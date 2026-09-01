# Two variants build from the one source, cv.tex.
#
#   make            academic CV  -> ../static/noah_marshall_cv.pdf  (linked from the site)
#   make industry   industry CV  -> cv_industry.pdf                 (local only, not published)
#   make clean      drop LaTeX aux files
#
# Needs xelatex (the class uses fontspec, so pdflatex will not work).

BUILD := .build
SRC   := cv.tex muratcan_cv.cls
XETEX := xelatex -interaction=nonstopmode -halt-on-error -output-directory=$(BUILD)

.PHONY: all industry clean

all: ../static/noah_marshall_cv.pdf

../static/noah_marshall_cv.pdf: $(SRC)
	@mkdir -p $(BUILD)
	$(XETEX) cv.tex
	$(XETEX) cv.tex
	cp $(BUILD)/cv.pdf $@

industry: $(SRC)
	@mkdir -p $(BUILD)
	$(XETEX) -jobname=cv_industry '\def\industryversion{1}\input{cv.tex}'
	$(XETEX) -jobname=cv_industry '\def\industryversion{1}\input{cv.tex}'
	cp $(BUILD)/cv_industry.pdf cv_industry.pdf

clean:
	rm -rf $(BUILD)
