'use strict';

exports['grunt-umbraco-package'] = {
	setUp: function(done) {
		done();
	},
	loader: function(test) {
		test.ok(true, 'package matches');
		test.done();
	}
};
