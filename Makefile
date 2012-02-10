
SRC = lib/header.js \
	lib/lunr.js \
	lib/utils.js \
	lib/index.js \
	lib/document.js \
	lib/trie.js \
	lib/word.js \

VERSION = $(shell cat VERSION)

all: lunr.js lunr.min.js

lunr.js: $(SRC)
	cat $^ | \
	sed "s/@VERSION/${VERSION}/" > $@

lunr.min.js: lunr.js
	uglifyjs < $< > $@

docs: lunr.js
	~/code/dox/bin/dox < lunr.js | node docs/doc_builder.js > docs/index.html
	~/code/dox/bin/dox < lunr.js > docs/index.json

size: lunr.min.js
	gzip -c lunr.min.js | wc -c

clean:
	rm -f lunr{.min,}.js

test:
	@node server 8003

.PHONY: test clean