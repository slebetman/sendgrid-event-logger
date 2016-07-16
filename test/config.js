var chai = require('chai');
var expect = chai.expect;
var default_config = require('../lib/default_config.json');
tester = require('./test_env');

var conf = require('../lib/config');

var fs = {
	readFileSync: function(){
		return JSON.stringify(default_config,null,4);
	},
	writeFileSync: function(path,data) {
		this.written += data;
	},
	written: ""
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

var fsErr3 = {
	readFileSync: function(){
		var err = new Error('EACCES: permission denied');
		err.code = 'EACCESS';
		throw err;
	},
	writeFileSync: function(path,data) {
		this.written += data;
	},
	written: ""
}

describe('config',function(){

	it('should require fs object',function(){
	
		expect(function(){
			conf.called = false;
			conf();
		}).to.throw(Error);
	
		expect(function(){
			conf(fs);
			conf(fs);
		}).to.not.throw(Error);
	});

	it('should return an object',function(){
		conf.called = false;
		var c = conf(fs);
		
		expect(c).to.be.an('object');
	});
	
	it('should ask user to install if config does not exist',function(){
		fsErr.written = "";
		var result = tester(function(){
			conf.called = false;
			conf(fsErr);
		});
		
		expect(fsErr.written).to.equal('');
		expect(result.logs.length).to.be.above(0);
		expect(result.exit).to.be.true;
	});
	
	it('should warn if cannot write to /etc',function(){
		var result = tester(function(){
			conf.called = false;
			conf(fsErr2);
		});
		
		expect(result.logs.length).to.be.above(1);
		expect(result.logs.join('\n')).to.contain('ERROR');
		expect(result.exit).to.be.true;
	});
	
	it('should throw on other errors',function(){
		fsErr3.written = "";
		expect(function(){
			conf.called = false;
			conf(fsErr3);
		}).to.throw(Error);
	});
	
	it('should provide a function to install config',function(){
		fs.written = "";
		var result = tester(function(){
			conf.init(fs);
		});
		
		expect(JSON.parse(fs.written)).to.deep.equal(default_config);
		expect(result.logs.join('\n')).to.contain('installed');
	});
	
	it('should handle write errors when installing config',function(){
		var result = tester(function(){
			conf.init(fsErr2);
		});
		
		expect(result.logs.join('\n')).to.contain('ERROR');
	});
});