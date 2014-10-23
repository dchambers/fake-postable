var build = require('dchambers-lib-build-tool');

build.bundleDeps(
	build.bundle('fake-postable.js', ['./lib/global-fake-postable.js']),
	build.bundle('fake-postable-spec-tests.js', ['./spec/test/tests.spec.js'])
);
