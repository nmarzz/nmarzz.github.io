---
layout: post
title: "Deploying a ML Twitter Bot on AWS Lambda"
date: 2021-01-19
---


A while ago I trained a neural network to write poetry. Sometimes the model misses the mark and sometimes it writes some interesting poetry.

I'd 'been hosting it on an AWS EC2 server but now my 12 months of free-tier is running out. The bot only tweets a new poem once a day anyway so EC2 was a little overkill. I decided to check out a serverless framework and move it over to AWS Lambda. The process is usually fairly straightforward but I did encounter some roadblocks along the way and figured it would be good to share.

One of the larger annoyances was the size of the Tensorflow library. Due to Lambda's hard cap only allowing deployment packages of 250MB and Tensorflow taking up the better part of a gigabyte I had to find a work around.

The Tensorflow developers envisioned this very scenario and they built [Tensorflow lite](https://www.tensorflow.org/lite) specifically as a lightweight version of Tensorflow for edge devices and memory limited applications in general. However, (at least at the time I write this) the Tensorflow lite converter does not work with the recurrent GRU unit I have in my model. The docs said it did but the GitHub issues page points to it being a known problem.

The workaround is to store the Tensorflow library in AWS Elastic File System (EFS). It is a little overkill but it works. In this post I'll go over:

- How to create a Lambda function
- How to store Tensorflow (or any package) in EFS
- How to mount EFS into Lambda
- How to send tweets generated in a EFS mounted Lambda function



For this post we'll just be using the Management Console and the in browser editors. If you like you can develop using a framework such as [Serverless](https://www.serverless.com/).

## Loading the Tensorflow library into EFS

The Tensorflow library is somewhere in the ballpark of 750MB far above Lambda's maximum. Luckily, we are able to load packages via the EFS service.

### First create the EFS

From the Management Console search for EFS. Once at the service click on **Create file system**. The following screen should pop up. Name it something memorable and select your Virtual Private Cloud (VPC). I just used the default because I don't use this account for much else.

<img src="/imgs/createEFS.png" alt="createEFS" style="zoom:50%;" />

### Create an Access Point

From your new file system click the **Access points** tab and then click **Create access point**. Give it a name and root directory. Enter the following details and a tag.

<img src="/imgs/accessPointDetails.png" alt="createEFS" style="zoom:50%;" />



Now that we have a file system, we can load Tensorflow into it. It is easiest to do so through an EC2 instance. I chose to use the t2.medium instance. It isn't free-tier eligible but it is cheap and you don't need to have it running for long. It ended up costing me 0.14$CAD. The free-tier option will work as well, but expect to be waiting for a little and watch out for memory issues.

We won't go through too many details of how to do this mostly because of these excellent Youtube tutorials from [Srce Cde](https://www.youtube.com/srcecde):

- [How to use EFS (Elastic File System) with AWS Lambda](https://www.youtube.com/watch?v=4cquiuAQBco&ab_channel=SrceCde)
- [How to mount EFS on EC2 instance](https://www.youtube.com/watch?v=PHVthx8lG4g&ab_channel=SrceCde)
- [How to install library on EFS & import in lambda](https://www.youtube.com/watch?v=FA153BGOV_A&ab_channel=SrceCde)

A few things to note:

- Make sure you choose an Ubuntu instance when starting your EC2 server.
- When it comes to mounting EFS on your EC2 instance I would recommend setting the instance to automatically mount your file system. This saves the hassle of doing it manually
  - Choose your Machine Image (Ubuntu Server) and Instance Type (I chose t2.medium)
  - From "Configure Instance Details" scroll down to File Systems
  - Click "Add file system" and choose your EFS
  - Now your EFS will automatically mount in the "/mnt/YOUR_DIR/fs1" directory



Once the libraries you want are in EFS we can move onto creating our Lambda function.

## Creating a Lambda Function

From the AWS Management Console search for Lambda and then click **Create Function**. We'll choose **Author from scratch** and choose Python 3.8 as our runtime. Then we'll create our function.

<img src="/imgs/createLambda.png" alt="createEFS" style="zoom:100%;" />

Now we have to connect our Lambda function to the same VPC as our EFS system. First we need to add some permissions. In the **Permissions** tab of your function click the role name. Then click the policy name. You're screen should look like this.

<img src="/imgs/policySummary.png" alt="createEFS" style="zoom:100%;" />

Click **Edit Policy** and add the following JSON lines in the Statement.

~~~json
{
      "Effect": "Allow",
      "Action": [
        "ec2:DescribeNetworkInterfaces",
        "ec2:CreateNetworkInterface",
        "ec2:DeleteNetworkInterface",
        "ec2:DescribeInstances",
        "ec2:AttachNetworkInterface"
      ],
      "Resource": "*"
    }
~~~

**Review policy** and **Save changes** and you can close the tab.

### Connect to VPC and EFS

Now back on your Lambda function's page scroll down to the VPC tab. Click **Edit** and choose the same VPC as you have your EFS file system on. Choose all the subnets and your security group.

<img src="/imgs/configVPC.png" alt="createEFS" style="zoom:100%;" />

Notice that connecting to a VPC prevents you from directly accessing the Internet from your function. We'll have to work around this later in order to send out tweets.

Now we'll add our EFS. From your function click the **File system** tab and add a file system. Choose the file system and access point you just set up. Finally, give it a root path.

<img src="/imgs/fileSystemLambda.png" alt="createEFS" style="zoom:75%;" />

## Testing it out

By default Lambda times out after 3s. We'll need more time than that in order to load our Tensorflow library from EFS. In the **Basic settings** tab of your function change the timeout time to ~1min and give it some more memory as well. 512MB will be plenty.

Now replace the pre-populated code with the following

~~~python
try: # Mount EFS
    import sys
    import os
    sys.path.append('/mnt/YOUR_DIR/')
except ImportError:
    print('Error mounting EFS')     

import json
import tensorflow as tf

def lambda_handler(event, context):      
    return {'tweet':tf.__version__ }   
~~~

This code mounts EFS, loads Tensorflow and verifies that Tensorflow imported correctly. If everything works you will see the following output.

<img src="/imgs/tfResponse.png" alt="createEFS" style="zoom:100%;" />

Ok, we are nearly there. So far we have

- Stored Tensorflow in EFS
- Created a Lambda function
- Mounted EFS in Lambda
- Successfully loaded and used the Tensorflow library in our Lambda function

## Tweeting from Lambda

In order to mount EFS we have to put our function inside of a VPC. Unfortunately, the VPC makes it so we can't directly access the internet from our function. If we want to do something like tweet we clearly need internet access.

AWS recommends using a NAT gateway in order to get around this problem. For industry applications this probably is best. However, for simpler applications where the Lambda function won't be called too often I think it is simpler just to invoke our function with another Lambda function outside of the VPC.

The drawback of this is that we are paying for 2 Lambda functions at once. However, AWS offers free-tier usage of Lambda up to 1M requests and 400,000 GBseconds per month. For a simple bot this more than enough so invoking 2 functions at once isn't much of a worry. Plus we skip all the hassle of configuring the NAT gateway and we don't need to pay for one either.  

### Tweepy

In order to tweet from the [Twitter API](https://developer.twitter.com/en/docs) you have to make a [Twitter developer account](https://developer.twitter.com/en/apply-for-access). Once you have that you'll also be given

- Consumer key
- Consumer secret key
- Access token
- Access secret token

You'll need these in order to tweet from your account. Tweepy is Twitter's python API. We'll also need this library in order to tweet. This time we can't use EFS, but luckily Lambda has the ability to add layers. We'll create a layer that holds Tweepy.

You'll have to install Tweepy and save it to

~~~python
python/lib/python3.*/site-packages/
~~~

this is the path that AWS expects python packages to be kept in. In order to install, I found it easiest to start a clean virtual environment and then install Tweepy in that.

Once you have your package installed you'll have to compress it as a .zip. Then go the the Lambda console and select **Layers**. Select **Create layer** and upload your compressed file. I installed a python3.7 version of Tweepy so I chose that as my runtime. You'll have to chose yours.

<img src="/imgs/tweepyLayer.png" alt="createEFS" style="zoom:50%;" />

Hit create and now we have a Tweepy layer that we can load in as a python package.

Create a new Lambda function now. This will be our driver function. Once you have created your new function select the **Layers** tab and add the Tweepy layer you just created. Now Tweepy should import successfully.

~~~python
import tweepy
~~~

In order to use Tweepy we'll need the keys and secrets we got from Twitter. We'll set those as environment variables to keep them out of the code. From your new driver function go to the **Environment variables** tab and enter your keys and secrets.

<img src="/imgs/environmentVars.png" alt="createEFS" style="zoom:50%;" />

And that's it! We've now done the following

- Put Tensorflow in a EFS system
- Mounted the EFS system to a worker Lambda function
- Used our worker to load and execute Tensorflow
- Created a driver Lambda function outside of our VPC
- Set up a Lambda Layer that holds our Tweepy package

All that's left to do now is to apply it. Adding the following code to the driver function invokes our worker using Amazon's boto3 library and tweets the returned result from the worker.

~~~python
import json
import boto3
import tweepy
import ast
import os

def tweet_string(tweet):
        auth = tweepy.OAuthHandler(os.environ['consumer_key'], os.environ['consumer_secret'])
        auth.set_access_token(os.environ['access_token'], os.environ['access_token_secret'])
        api = tweepy.API(auth, wait_on_rate_limit= True, wait_on_rate_limit_notify= True)
        api.update_status(status = tweet)


def callbot(event, context):

    # Connect to worker
    client = boto3.client('lambda')
    response = client.invoke(FunctionName='YOUR_WORKER_FUNCTION_NAME')

    # Read tweet
    dict_resp = response['Payload'].read().decode('UTF-8')
    mydata = ast.literal_eval(dict_resp)
    tweet = mydata['tweet']
    tweet_string(tweet)

    # Log tweet
    return {
        'statusCode': 200,
        'body': json.dumps('Tweeted \n: {}'.format(tweet))
    }  
~~~

You can use [AWS EventBridge](https://aws.amazon.com/eventbridge/) in order to tweet using cron or in response to other events. Just set it up to invoke your driver function in response to your desired event.



 If you are interested in seeing my bot in action check it out at [@poetrybot5](https://twitter.com/poetrybot5) on Twitter.
