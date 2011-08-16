/**
 * A Node.js module or interacting with the 189works API.
 */
var qs = require('querystring');
var http = require('http');
var crypto = require('crypto');
var trp_des = require('./3des.js')

var config = {}
var product_ids = {}

init = function(api_id, key) {
  if (api_id === undefined || key === undefined) {
  	return false;
  } else {
    this.config = {}
    this.host = '125.64.11.43'
    this.port = 8080
    this.path = '/udt-see/StartServiceServlet'
  	this.config.api_id = api_id;
  	this.config.key = key;
  	this.product_ids = {}
  	this.product_ids.sms = '100000000000000000016';

  	return true;
  }
};

send_sms = function(options, callback) {
  
};

request = function(parameters, callback) {
  var req_params = {}
  var current_time = new Date()
  req_params.params = {}
  req_params.params.TimeStamp = timestamp(new Date())
  req_params.params.APID = this.config.api_id
  var des_out = trp_des.trp_des(req_params.params.TimeStamp+this.config.api_id, this.config.key);
  req_params.params.Key = des_out;
  req_params.params.Num = parameters.number
  req_params.params.Msg = parameters.message
  
  req_params.params.IsReport = '0'
  req_params.params.StatusReportUrl = 'http://114.80.110.16'
  req_params.params.ProductID = this.product_ids.sms
  req_params.params.IsUse = '0'
  req_params.serviceId = '00001020101130';
  req_params.params.Parm1 = "12"
  req_params.params.Parm2 = this.product_ids.sms
  req_params.params.Parm3 = "56"
  
  
  var options = {
    host: this.host,
    port: this.port,
    path: this.path,
    method: 'POST'
  };

  var req = http.request(options, function(res) {
    // console.log('STATUS: ' + res.statusCode);
    // console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      console.log('BODY: ' + chunk);
    });
  });
  console.log(JSON.stringify(req_params))
  req.write(JSON.stringify(req_params));
  req.end();
}

timestamp = function(date) {
  var year    = date.getFullYear().toString();
  var month   = (date.getMonth() + 1).toString();
  var day     = date.getDate().toString();
  var hour    = date.getHours().toString();
  var minute  = date.getMinutes().toString();
  var seconds = date.getSeconds().toString();
  
  return year + add_missing_zero(month) + add_missing_zero(day) + add_missing_zero(hour)+ add_missing_zero(minute) + add_missing_zero(seconds);
};

add_missing_zero = function(value) {
  return (value.length === 1 ? "0"+value : value)
};

encrypt = function(string, key) {
  console.log(string);
  console.log(key)
  var cipher = crypto.createCipher('des-ede3-cbc', key);
  var ciph = cipher.update(string, 'utf8', 'hex');

  return ciph;
};

exports.init = init;
exports.config = config;
exports.send_sms = send_sms;
exports.request = request;
