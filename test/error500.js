var mockHttp = require('node-mocks-http');
var chai = require('chai');
var expect = chai.expect;
var error500 = require('../lib/error500');
var tester = require('./test_env');

describe('error500',function(){

	it('should return a 500 error response',function(){
		var res = mockHttp.createResponse();
		
		tester(function(){
			error500(res);
		});
		
		var headers = res._getHeaders();
		var body = res._getData();
		
		expect(res.statusCode).to.equal(500);
		expect(body).to.equal('{"status":"error","error":500}');
	});
	
	it('should return a 500 error response with details if provided',function(){
		var res = mockHttp.createResponse();
		
		tester(function(){
			error500(res,'HELLO');
		});
		
		var headers = res._getHeaders();
		var body = res._getData();
		
		expect(res.statusCode).to.equal(500);
		expect(body).to.equal('{"status":"error","error":500,"detail":"HELLO"}');
	});
});
