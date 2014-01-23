#/usr/bin/env/sh

# http://www.alolo.co/blog/2013/11/7/making-travis-ci-test-your-components

set -e
phantomjs test/env/runner.js http://localhost:3000/test/index.html
phantomjs test/env/runner.js http://localhost:3000/test/index_built.html

