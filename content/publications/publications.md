---
layout: "single"
title: "Publications"
url: "/publications"
---
 
<script src="https://kit.fontawesome.com/b4ec852ae6.js" crossorigin="anonymous"></script>
<!-- <link rel="stylesheet" href="http://netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css"> -->
<script src="https://code.jquery.com/jquery-1.11.0.min.js"></script>
<script src="https://netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js"></script>


#### Click the:
- <i class="fa-solid fa-apple-whole"></i> Apple for an Arxiv link
- <i class="fa-solid fa-compass-drafting"></i> Compass for the conference/journal link
- <i class="fa-solid fa-book"></i> Book for a bibtex dropdown


<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/pcooksey/bibtex-js@1.0.0/src/bibtex_js.js"></script>
<bibtex src="../publications.bib"></bibtex>

<div class="bibtex_structure">
  <div class="group year" extra="DES number">
    <h2 class="title"></h2>
    <div class="templates"></div>
  </div>
</div>

<div id="bibtex_display"></div> 

<div class="bibtex_template"> 
    <li>
    <div class="if author">
        <span class="author"></span><span>.</span>
        <span class="if title"><b><span class="title"></span></b>,</span>
	</div>		      
    <span class="if journal"><em><span class="journal"></span></em>,</span>
    <span class="if booktitle">In <em><span class="booktitle"></span></em>,</span>
    <span class="if editor"><span class="editor"></span> (editors),</span>
    <span class="if publisher"><em><span class="publisher"></span></em>,</span>
    <span class="if institution"><span class="institution"></span>,</span>
    <span class="if address"><span class="address"></span>,</span>
    <span class="if volume"><span class="volume"></span>,</span>
    <span class="if journal number">(<span class="number"></span>),</span>
    <span class="if pages"> pages <span class="pages"></span>,</span>
    <span class="if month"><span class="month"></span>,</span>
    <span class="if year"><span class="year"></span>.</span>
    <span class="if note"><span class="note"></span>.</span>
    <span class="if eprint">
        <a class="bibtexVar" 
            role="button" 
            href="https://arxiv.org/abs/+EPRINT+" 
            extra="EPRINT">
        <i class="fa-solid fa-apple-whole"></i>
        </a>
    </span>   
    <span class="if doi">
        <a class="bibtexVar" 
            role="button" 
            href="https://doi.org/+DOI+"
            extra="DOI">
        <i class="fa-solid fa-compass-drafting"></i>
        </a>
    </span>
    <a class="bibtexVar" 
			   role="button" 
			   data-toggle="collapse" 
			   href="#bib+BIBTEXKEY+" 
			   aria-expanded="false" 
			   aria-controls="bib+BIBTEXKEY+" 
			   extra="BIBTEXKEY">
			  <i class="fa-solid fa-book"></i>
    </a>
    <div class="bibtexVar collapse" id="bib+BIBTEXKEY+" extra="BIBTEXKEY">
        <div class="well">
            <pre><span class="bibtexraw noread"></span></pre>
        </div>
    </div>    
    </li>
</div>
 