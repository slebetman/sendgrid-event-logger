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
	
});