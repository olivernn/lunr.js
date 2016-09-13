
SRC = lib/lunr.js \
	lib/utils.js \
	lib/idf.js \
	lib/token.js \
	lib/tokenizer.js \
	lib/pipeline.js \
	lib/vector.js \
	lib/stemmer.js \
	lib/stop_word_filter.js \
	lib/trimmer.js \
	lib/token_set.js \
	lib/token_set_builder.js \
	lib/index.js \
	lib/builder.js \
	lib/match_data.js \
	lib/query.js \
	lib/query_parse_error.js \
	lib/query_lexer.js \
	lib/query_parser.js \

YEAR = $(shell date +%Y)
VERSION = $(shell cat VERSION)

SERVER_PORT ?= 3000
TEST_PORT ?= 32423

DOX ?= ./node_modules/.bin/dox
DOX_TEMPLATE ?= ./node_modules/.bin/dox-template
NODE ?= $(shell which node)
NPM ?= $(shell which npm)
PHANTOMJS ?= ./node_modules/.bin/phantomjs
UGLIFYJS ?= ./node_modules/.bin/uglifyjs
QUNIT ?= ./node_modules/.bin/qunit
MOCHA ?= ./node_modules/.bin/mocha
MUSTACHE ?= ./node_modules/.bin/mustache
ESLINT ?= ./node_modules/.bin/eslint
JSDOC ?= ./node_modules/.bin/jsdoc
NODE_STATIC ?= ./node_modules/.bin/static

all: node_modules lunr.js lunr.min.js docs bower.json package.json component.json example

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

server:
	${NODE_STATIC} -H '{"Cache-Control": "no-cache, must-revalidate"}'

lint:
	${ESLINT} lib/*.js

perf/*_perf.js:
	${NODE} -r ./perf/perf_helper.js $@

benchmark: perf/*_perf.js

test: node_modules lunr.js
	${MOCHA} test/*.js -u tdd -r test/test_helper.js -R dot -C

test/env/file_list.json: $(wildcard test/*test.js)
	${NODE} -p 'JSON.stringify({test_files: process.argv.slice(1)})' $^ > $@

test/index.html: test/env/file_list.json test/env/index.mustache
	${MUSTACHE} $^ > $@

docs: node_modules
	${JSDOC} -R README.mdown -d docs -c build/jsdoc.conf.json lib/*.js

clean:
	rm -f lunr{.min,}.js
	rm *.json
	rm example/example_index.json

reset:
	git checkout lunr.* *.json docs/index.html example/example_index.json

example: lunr.min.js
	${NODE} example/index_builder.js

node_modules: package.json
	${NPM} -s install

.PHONY: test clean docs reset example perf/*_perf.js
