
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
	lib/trimmer.js \
	lib/token_store.js \

YEAR = $(shell date +%Y)
VERSION = $(shell cat VERSION)

SERVER_PORT ?= 3000
TEST_PORT ?= 32423

DOX ?= /usr/local/bin/dox
DOX_TEMPLATE ?= /usr/local/bin/dox-template
NODE ?= /usr/local/bin/node
PHANTOMJS ?= /usr/local/bin/phantomjs
UGLIFYJS ?= /usr/local/share/npm/bin/uglifyjs

all: lunr.js lunr.min.js docs bower.json package.json component.json example

lunr.js: $(SRC)
	cat build/wrapper_start $^ build/wrapper_end | \
	sed "s/@YEAR/${YEAR}/" | \
	sed "s/@VERSION/${VERSION}/" > $@

lunr.min.js: lunr.js
	${UGLIFYJS} --compress --mangle --comments < $< > $@

%.json: build/%.json.template
	cat $< | sed "s/@VERSION/${VERSION}/" > $@

size: lunr.min.js
	@gzip -c lunr.min.js | wc -c

test_server:
	${NODE} server.js ${SERVER_PORT}

test:
	@${NODE} server.js ${TEST_PORT} > /dev/null 2>&1 & echo "$$!" > server.pid
	@${PHANTOMJS} test/env/runner.js http://localhost:${TEST_PORT}/test 2> /dev/null
	@cat server.pid | xargs kill
	@rm server.pid

docs:
	${DOX} < lunr.js | ${DOX_TEMPLATE} -n lunr.js -r ${VERSION} > docs/index.html

clean:
	rm -f lunr{.min,}.js
	rm *.json
	rm example/example_index.json

reset:
	git checkout lunr.* *.json docs/index.html example/example_index.json

example: lunr.min.js
	${NODE} example/index_builder.js

.PHONY: test clean docs reset example
