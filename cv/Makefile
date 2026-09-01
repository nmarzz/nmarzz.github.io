# Two variants build from the one source, cv.tex.
#
#   make            industry/quant CV -> ../static/noah_marshall_cv.pdf  (published by the site)
#   make academic   full academic CV  -> cv_academic.pdf                 (local only)
#   make clean      drop LaTeX aux files
#
# The published CV is the industry variant: it carries the Skills section and
# omits the undergraduate teaching entries. Needs xelatex (the class uses
# fontspec, so pdflatex will not work).

BUILD := .build
SRC   := cv.tex muratcan_cv.cls Makefile
XETEX := xelatex -interaction=nonstopmode -halt-on-error -output-directory=$(BUILD)

.PHONY: all academic clean

all: ../static/noah_marshall_cv.pdf

../static/noah_marshall_cv.pdf: $(SRC)
	@mkdir -p $(BUILD)
	$(XETEX) -jobname=cv_industry '\def\industryversion{1}\input{cv.tex}'
	$(XETEX) -jobname=cv_industry '\def\industryversion{1}\input{cv.tex}'
	cp $(BUILD)/cv_industry.pdf $@

academic: $(SRC)
	@mkdir -p $(BUILD)
	$(XETEX) cv.tex
	$(XETEX) cv.tex
	cp $(BUILD)/cv.pdf cv_academic.pdf

clean:
	rm -rf $(BUILD)
