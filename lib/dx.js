/**
 * A Node.js module or interacting with the 189works API.
 */
var qs = require('querystring');
var http = require('http');
var crypto = require('crypto');
var des_crypto = require('./dessrc.js');
var jscrypt = require('./jscrypt.js');
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
  //req_params.params.Key = encrypt(req_params.params.TimeStamp+this.config.api_id, this.config.key)
  //req_params.params.Key = des_encrypt(req_params.params.TimeStamp+this.config.api_id, this.config.key)
  var des_out = trp_des.trp_des(req_params.params.TimeStamp+this.config.api_id, this.config.key);
  log("des_out", des_out);
  req_params.params.Key = des_out;
  req_params.params.Num = parameters.number
  req_params.params.Msg = parameters.message
  
  req_params.params.IsReport = '0'
  req_params.params.StatusReportUrl = 'http://114.80.110.16'
  req_params.params.productID = this.product_ids.sms
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

des_encrypt = function(str, key) {
	//var key_seed = jscrypt.Generate_key();
	log("str", str);
	log("key", key);
	//var hex_key = chars_from_hex(key);
	var hex_key = toHex(key);
	var vector = '';
	log("hex_key", hex_key);
	vector = (vector.length > 7) ? vector : null;
	log("hex_key", hex_key);
	log("vector", vector);
	var output = des_crypto.des(hex_key, str, 1, vector ? 1 : 0, vector);
	output = hex_from_chars(output);
	log("output", output);
	return output;
}

log = function(name, content) {
	console.log("#############" + name + ": " + content);
}

function toAscii()
{
	var symbols = " !\"#$%&'()*+,-./0123456789:;<=>?@";
	var loAZ = "abcdefghijklmnopqrstuvwxyz";
	symbols+= loAZ.toUpperCase();
	symbols+= "[\\]^_`";
	symbols+= loAZ;
	symbols+= "{|}~";

    valueStr = document.form1.hex.value;
    valueStr = valueStr.toLowerCase();
    var hex = "0123456789abcdef";
    var text = "";
    var i=0;

    for( i=0; i<valueStr.length; i=i+2 )
    {
        var char1 = valueStr.charAt(i);
        if ( char1 == ':' )
        {
            i++;
            char1 = valueStr.charAt(i);
        }
        var char2 = valueStr.charAt(i+1);
        var num1 = hex.indexOf(char1);
        var num2 = hex.indexOf(char2);
        var value = num1 << 4;
        value = value | num2;

        var valueInt = parseInt(value);
        var symbolIndex = valueInt - 32;
        var ch = '?';
        if ( symbolIndex >= 0 && value <= 126 )
        {
            ch = symbols.charAt(symbolIndex)
        }
        text += ch;
    }

    document.form1.ascii.value = text;
    return false;
}

function toHex(str)
{
	var symbols = " !\"#$%&'()*+,-./0123456789:;<=>?@";
	var loAZ = "abcdefghijklmnopqrstuvwxyz";
	symbols+= loAZ.toUpperCase();
	symbols+= "[\\]^_`";
	symbols+= loAZ;
	symbols+= "{|}~";

    var valueStr = str;
    var hexChars = "0123456789abcdef";
    var text = "";
    for( i=0; i<valueStr.length; i++ )
    {
        var oneChar = valueStr.charAt(i);
        var asciiValue = symbols.indexOf(oneChar) + 32;
        var index1 = asciiValue % 16;
        var index2 = (asciiValue - index1)/16;
        if ( text != "" ) text += "";
        text += hexChars.charAt(index2);
        text += hexChars.charAt(index1);
    }
    return text;
}

chars_from_hex = function(inputstr) {
	var outputstr = '';
    inputstr = inputstr.replace(/^(0x)?/g, '');
    inputstr = inputstr.replace(/[^A-Fa-f0-9]/g, '');
    inputstr = inputstr.split('');
    for(var i=0; i<inputstr.length; i+=2) {
        outputstr += String.fromCharCode(parseInt(inputstr[i]+''+inputstr[i+1], 16));
    }
    return outputstr;
}

function hex_from_chars(inputstr) {
	var delimiter = '';
	var outputstr = '';
	var hex = "0123456789abcdef";
	hex = hex.split('');
	var i, n;
	var inputarr = inputstr.split('');
	for(var i=0; i<inputarr.length; i++) {
		if(i > 0) outputstr += delimiter;
		if(!delimiter && i % 32 == 0 && i > 0) outputstr += '\n';
		n = inputstr.charCodeAt(i);
		outputstr += hex[(n >> 4) & 0xf] + hex[n & 0xf];
	}
	return outputstr;
}

exports.init = init;
exports.config = config;
exports.send_sms = send_sms;
exports.request = request;
