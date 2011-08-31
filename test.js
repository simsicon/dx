dx = require('./index');
util = require('util');
dx.init('apiid', 'key');
dx.request({number: 'phonenumber', message: 'msg'});


