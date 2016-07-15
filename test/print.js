var chai = require('chai');
var expect = chai.expect;
var print = require('../lib/print');
var tester = require('./test_env');

describe('print',function(){

	it('should console.log',function(){
		result = tester(function(){
			print(`
				Hello World!
			`);
		});
		expect(result.logs.join('\n')).to.equal('\nHello World!\n');
	});
});
