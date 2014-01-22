
SRC = lib/lunr.js \
	lib/utils.js \
	lib/event_emitter.js \
	lib/tokenizer.js \
	lib/pipeline.js \
	lib/vector.js \
	lib/sorted_set.js \
	lib/index.js \
	lib/document_store.js \
	lib/stemmer.js \
	lib/stop_word_filter.js \
	lib/token_store.js

YEAR = $(shell date +%Y)
VERSION = $(shell cat VERSION)

all: lunr.js lunr.min.js docs bower.json package.json component.json

lunr.js: $(SRC)
	for src in $^ ; do cat $$src; echo ";" ; done | \
	sed "s/@YEAR/${YEAR}/" | \
	sed "s/@VERSION/${VERSION}/" > $@

lunr.min.js: lunr.js
	uglifyjs --compress --mangle --comments < $< > $@

%.json: build/%.json.template
	cat $< | sed "s/@VERSION/${VERSION}/" > $@

size: lunr.min.js
	gzip -c lunr.min.js | wc -c

test_server:
	node server.js 3000

test:
	phantomjs test/env/runner.js http://localhost:3000/test

docs:
	dox < lunr.js | dox-template -n lunr.js -r ${VERSION} > docs/index.html

clean:
	rm -f lunr{.min,}.js
	rm bower.json
	rm package.json
	rm component.json

.PHONY: test clean docs
