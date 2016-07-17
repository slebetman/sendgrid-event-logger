var chai = require('chai');
var expect = chai.expect;
var tester = require('./test_env');

var check = require('../lib/elasticsearch-check');

var mockElastic = {
	indices: {
		existsTemplate_called: false,
		existsTemplate_err: null,
		existsTemplate_data: '',
		existsTemplate:function(opt,callback){
			this.existsTemplate_called = true;
			callback(this.existsTemplate_err,this.existsTemplate_data);
		},
		putTemplate_called: false,
		putTemplate_err: null,
		putTemplate_data: '',
		putTemplate:function(opt,callback){
			this.putTemplate_called = true;
			callback(this.putTemplate_err,this.putTemplate_data);
		}
	}
}

describe('elasticsearch-check',()=>{

	it('should check if template exists',()=>{
		var callback_called = false;
		tester(()=>{
			mockElastic.indices.existsTemplate_called = false;
			mockElastic.indices.existsTemplate_data = true;
			check(mockElastic,()=>{
				callback_called = true;
			});
		});
		
		expect(mockElastic.indices.existsTemplate_called).to.be.true;
		expect(callback_called).to.be.true;
	});
	
	it('should handle connection errors',()=>{
		var callback_called = false;
		var res = tester(()=>{
			mockElastic.indices.existsTemplate_called = false;
			mockElastic.indices.existsTemplate_err = new Error('TEST');
			check(mockElastic,()=>{
				callback_called = true;
			});
		});
		expect(res.logs.join('\n')).to.contain('ERROR');
		expect(res.exit).to.be.true;
	});
	
	it('should install template if not exist',()=>{
		var callback_called = false;
		var res = tester(()=>{
			mockElastic.indices.existsTemplate_data = false;
			mockElastic.indices.existsTemplate_err = null;
			mockElastic.indices.putTemplate_called = false;
			check(mockElastic,()=>{
				callback_called = true;
			});
		});
		expect(res.logs.join('\n')).to.contain('Installing');
		expect(mockElastic.indices.putTemplate_called).to.be.true;
		expect(callback_called).to.be.true;
	});
	
	it('should handle errors when installing template',()=>{
		var callback_called = false;
		var res = tester(()=>{
			mockElastic.indices.existsTemplate_data = false;
			mockElastic.indices.existsTemplate_err = null;
			mockElastic.indices.putTemplate_err = new Error('TEST');
			check(mockElastic,()=>{
				callback_called = true;
			});
		});
		expect(res.logs.join('\n')).to.contain('ERROR');
		expect(callback_called).to.be.false;
	});
	
});
