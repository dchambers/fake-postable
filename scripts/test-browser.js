var build = require('dchambers-lib-build-tool');
build.karmaTest('Browser Tests', ['dist/fake-postable-spec-tests.js'], ['Firefox', 'Chrome_ES6'], true);
