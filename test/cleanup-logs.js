var chai = require('chai');
var expect = chai.expect;
var tester = require('./test_env');

var cleaner = require('../lib/cleanup-logs');

var mockElastic = {
	cat: {
		indices_data: '',
		indices_called: false,
		indices: function(opt,callback){
			this.indices_called = true;
			callback(null,this.indices_data);
		}
	},
	indices: {
		delete_called: false,
		deleted: [],
		'delete': function(opt,callback){
			this.delete_called = true;
			this.deleted.push(opt.index);
			callback();
		}
	}
}

function indexDate (t) {
	return t.toISOString().split('T')[0].replace(/-/g,'.');
}

describe('cleanup-logs',()=>{

	it('should return a function to be called periodically',()=>{
		tester(()=>{
			var p = cleaner({},1);
			
			expect(p).to.be.a('function');
		});
	});
	
	it('should check elasticsearch indices',()=>{
		mockElastic.cat.indices_called = false;
		
		tester(()=>{
			var p = cleaner(mockElastic,1);		
			p();
			
			expect(mockElastic.cat.indices_called).to.be.true;
		});
	});

	it('should delete old indices',(callback)=>{
		var now = new Date();
		var today_index = 'mail-' + indexDate(now);
		var old_index = 'mail-' + indexDate(new Date(
			now.valueOf() - cleaner.days(365)
		));
		
		mockElastic.indices.delete_called = false;
		mockElastic.indices.deleted = [];
		mockElastic.cat.indices_data = `
			x x ${today_index} x x
			x x ${old_index} x x
		`.replace(/^\s+/mg,'');
		
		cleaner.testCallback = function () {
			callback();
		};
		
		tester(()=>{
			var p = cleaner(mockElastic,360);
			p();
			
			expect(mockElastic.indices.delete_called).to.be.true;
			expect(mockElastic.indices.deleted[0]).to.equal(old_index);
		});
	});
	
	it('should return null function if disabled',()=>{
		var p;
		tester(()=>{
			p = cleaner(mockElastic,false);
		});	
		
		expect(p.toString()).to.equal('()=>{}');
	});
});
