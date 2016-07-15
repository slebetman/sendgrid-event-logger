var chai = require('chai');
var expect = chai.expect;
var default_config = require('../lib/default_config.json');
tester = require('./test_env');

var conf = require('../lib/config');

var default_config = {
	"elasticsearch_host": "localhost:9200",
	"port": 8080,
	"use_basicauth": false,
	"basicauth" : {
		"user": "",
		"password": ""
	},
	"use_https": false,
	"https": {
		"key_file": "",
		"cert_file": ""
	}
};

var fs = {
	readFileSync: function(){
		return JSON.stringify(default_config,null,4);
	}
};

var fsErr = {
	readFileSync: function(){
		var err = new Error('ENOENT: no such file or directory');
		err.code = 'ENOENT';
		throw err;
	},
	writeFileSync: function(path,data) {
		this.written += data;
	},
	written: ""
}

var fsErr2 = Object.create(fsErr);
fsErr2.writeFileSync = function(){
	var err = new Error('EACCES: permission denied');
	err.code = 'EACCES';
	throw err;
}

describe('config',function(){

	it('should require fs object',function(){
	
		expect(function(){
			conf.called = false;
			conf();
		}).to.throw(Error);
	
		expect(function(){
			conf.called = false;
			conf(fs);
		}).to.not.throw(Error);
	});

	it('should return an object',function(){
		conf.called = false;
		var c = conf(fs);
		
		expect(c).to.be.an('object');
	});
	
	it('should install default config if file does not exist',function(){
		fsErr.written = "";
		var result = tester(function(){
			conf.called = false;
			conf(fsErr);
		});
		
		expect(fsErr.written).to.equal(JSON.stringify(default_config,null,4));
		expect(result.logs.length).to.be.above(0);
		expect(result.exit).to.be.true;
	});
	
	it('should warn if cannot write to /etc',function(){
		fsErr2.written = "";
		var result = tester(function(){
			conf.called = false;
			conf(fsErr2);
		});
		
		expect(result.logs.length).to.be.above(1);
		expect(result.logs.join('\n')).to.contain('ERROR');
		expect(result.exit).to.be.true;
	});
});