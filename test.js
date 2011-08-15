dx = require('./index');
util = require('util');
dx.init('apid', 'key');
dx.request({number: 'number', message: 'testtext'});


