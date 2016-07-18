var mockHttp = require('node-mocks-http');
var tester = require('./test_env');
var chai = require('chai');
var expect = chai.expect;

var middleware = require('../lib/json-post-middleware');

describe('json-post-middleware',()=>{
	
	it('should process post request then hand it over to next',(done)=>{
		var testPayload = JSON.stringify({hello:'world'});
	
		var req = mockHttp.createRequest({
			method: 'POST',
			headers: {
				'content-length': testPayload.length
			}
		});
		var res = mockHttp.createResponse();
		
		middleware(req,res,()=>{
			expect(req.body).to.deep.equal(JSON.parse(testPayload));
			done();
		});
		
		req.emit('data',testPayload);
	});
	
	it('should handle post request with multiple packets',()=>{
		var testPayload = JSON.stringify({hello:'world'});
	
		var req = mockHttp.createRequest({
			method: 'POST',
			headers: {
				'content-length': testPayload.length
			}
		});
		var res = mockHttp.createResponse();
		
		var callback_is_called = false;
		middleware(req,res,()=>{
			callback_is_called = true;
		});
		
		req.emit('data',testPayload.substr(0,5));
		req.emit('data',testPayload.substr(5));
		expect(req.body).to.deep.equal(JSON.parse(testPayload));
		expect(callback_is_called).to.be.true;
	});
	
	it('should handle malformed JSON data',()=>{
		var testPayload = "monkey}}[";
		
		var req = mockHttp.createRequest({
			method: 'POST',
			headers: {
				'content-length': testPayload.length
			}
		});
		var res = mockHttp.createResponse();
		
		var callback_is_called = false;
		middleware(req,res,()=>{
			callback_is_called = true;
		});
		
		tester(()=>{
			req.emit('data',testPayload);
		});
		expect(callback_is_called).to.be.false;
		expect(res._isEndCalled()).to.be.true;
		expect(res.statusCode).to.equal(500);
	});
});