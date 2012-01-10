
SRC = lib/header.js \
	lib/augment.array.every.js \
	lib/augment.array.filter.js \
	lib/augment.array.forEach.js \
	lib/augment.array.indexOf.js \
	lib/augment.array.isArray.js \
	lib/augment.array.lastIndexOf.js \
	lib/augment.array.map.js \
	lib/augment.array.reduce.js \
	lib/augment.array.reduceRight.js \
	lib/augment.array.some.js \
	lib/augment.date.now.js \
	lib/augment.date.toISOString.js \
	lib/augment.date.toJSON.js \
	lib/augment.function.bind.js \
	lib/augment.object.getPrototypeOf.js \
	lib/augment.object.keys.js \
	lib/augment.string.trim.js

VERSION = $(shell cat VERSION)

all: augment.js augment.min.js

augment.js: $(SRC)
	cat $^ | \
	sed "s/@VERSION/${VERSION}/" > $@

augment.min.js: augment.js
	uglifyjs < $< > $@

size: augment.min.js
	gzip -c augment.min.js | wc -c

clean:
	rm -f augment{.min,}.js

test:
	@node server 8003

.PHONY: test clean