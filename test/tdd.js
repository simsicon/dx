var assert = require('assert');
var dx = require('../index.js') 

exports.testsStringLength = function(){
	assert.equal(6, 'foobar'.length);
};

exports.dxInit = function() {
	dx.init('999999','xxxxxx');
	assert.deepEqual('999999', dx.config.api_id, 'config api_id is not equal');
	assert.deepEqual('xxxxxx', dx.config.key, 'config key is not equal');
};
