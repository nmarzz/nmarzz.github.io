---
layout: post
title: "Saving training progress on kill signals"
date: 2021-06-26
---


Fairly often you are executing some long running python code. But for some reason, part way through execution, the process running the code gets a kill signal.

You might have decided the code has run long enough and hit CNTR + C to interrupt the process or maybe your SSH session got disconnected—and you are wishing you used a screen— or whatever else might happen.

This has happened often enough to me that it is worth it to throw in some safeguards to make sure progress isn't lost when that interrupt comes through.     

A typical training script looks something like this

```python
import time

# Some mock testing / training functions
def train(epoch):
    time.sleep(1)
    model.append(epoch)

def test():
    print(f'Testing iteration: {model[-1]}')

epochs = 10
model = []
# Defining our training loop
for epoch in range(epochs):
    train(epoch)
    test()    
```

  and when this code receives a kill signal it will just shutdown and all training progress is lost. With a few very simple additions you can mitigate losses.

```python
import signal
class SaveOnKillSignal:
    def __init__(self,shutdown_function):
        signal.signal(signal.SIGINT, shutdown_function)
        signal.signal(signal.SIGTERM, shutdown_function)
        signal.signal(signal.SIGHUP, shutdown_function)
```

This class will look for any SIGINT, SIGTERM, or SIGHUP and call  ```shutdown_function``` when that those signals are received.

```shutdown_function``` can take any form you like, just make sure to include the ```*args``` bit.

```python
def shutdown_function(*args):
    with open('sigint_file.txt','w+') as file:
        file.write(f'Model state: {model}')       
```

and add an extra line before our training loop

```python
killer = SaveOnKillSignal(shutdown_function)
for epoch in range(epochs):
    train(epoch)
    test()   
```
