---
layout: "single"
title: "Publications"
url: "/publications"
---

<style>
  #bibtex_display ul {
    list-style: none;
    padding-left: 0;
  }
  #bibtex_display h2 {
    font-size: 1em;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    opacity: 0.5;
    margin-top: 2em;
    margin-bottom: 0.75em;
    border-bottom: 1px solid currentColor;
    padding-bottom: 0.3em;
  }
  #bibtex_display li {
    margin-bottom: 1.4em;
    line-height: 1.6;
  }
  .pub-links {
    margin-top: 0.3em;
  }
  .pub-links a {
    display: inline-block;
    font-size: 0.78em;
    font-weight: 500;
    border: 1px solid currentColor;
    border-radius: 3px;
    padding: 1px 7px;
    margin-right: 4px;
    text-decoration: none;
    opacity: 0.75;
    transition: opacity 0.15s;
  }
  .pub-links a:hover {
    opacity: 1;
    text-decoration: none;
  }
  .pub-title {
    color: #4a6fa5;
  }
  body.dark .pub-title {
    color: #7aafd4;
  }
  .pub-bib pre {
    margin-top: 0.6em;
    font-size: 0.82em;
    padding: 0.8em 1em;
    border-radius: 4px;
    overflow-x: auto;
    border: 1px solid currentColor;
    opacity: 0.7;
  }
</style>

<script>
document.addEventListener('DOMContentLoaded', function() {
  var observer = new MutationObserver(function() {
    document.querySelectorAll('.pub-links a').forEach(function(a) {
      if (a.textContent.trim() === 'Paper' && a.href.includes('arxiv.org')) {
        a.parentElement.style.display = 'none';
      }
    });
  });
  var display = document.getElementById('bibtex_display');
  if (display) observer.observe(display, { childList: true, subtree: true });
});
</script>
<script src="https://code.jquery.com/jquery-1.11.0.min.js"></script>
<script src="https://netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js"></script>
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
    <div>
      <span class="author"></span>.
      <span class="if title"><b class="pub-title"><span class="title"></span></b>.</span>
      <span class="if journal"><em><span class="journal"></span></em>.</span>
      <span class="if booktitle">In <em><span class="booktitle"></span></em>.</span>
    </div>
    <div class="pub-links">
      <span class="if url">
        <a class="bibtexVar" href="+URL+" extra="URL">Paper</a>
      </span>
      <span class="if eprint">
        <a class="bibtexVar" href="https://arxiv.org/abs/+EPRINT+" extra="EPRINT">arXiv</a>
      </span>
      <a class="bibtexVar" role="button" data-toggle="collapse" href="#bib+BIBTEXKEY+"
         aria-expanded="false" aria-controls="bib+BIBTEXKEY+" extra="BIBTEXKEY">BibTeX</a>
      <div class="bibtexVar collapse pub-bib" id="bib+BIBTEXKEY+" extra="BIBTEXKEY">
        <pre><span class="bibtexraw noread"></span></pre>
      </div>
    </div>
  </li>
</div>
