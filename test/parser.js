var chai = require('chai');
var expect = chai.expect;

var p = require('../lib/parser');

function makeEvent () {
	return {
		"email": "nick@sendgrid.com",
		"timestamp": 1380822437,
		"newsletter": {
			"newsletter_user_list_id": "10557865",
			"newsletter_id": "1943530",
			"newsletter_send_id": "2308608"
		},
		"category": [
			"Tests",
			"Newsletter"
		],
		"event": "unsubscribe"
	};
}

describe('parser',function(){

	it('should provide function to generate date string',function(){
		var d = p.toDate(1380822437);
		expect(d).to.equal('2013.10.03');
	});

	it('should add date field to the event',function(){
		var e = p.processEvent(makeEvent());
		
		expect(e.date).to.equal('2013.10.03');
	});
	
	it('should provide function to generate index name',function(){
		var n = p.indexName(p.processEvent(makeEvent()));
		
		expect(n).to.equal('mail-2013.10.03');
	});
	
	it('should reject events without timestamp',()=>{
		expect(()=>{
			var e = p.processEvent({mango:'jango'});
		}).to.throw(Error);
	});

	it('should generate array suitable for bulk indexing',function(){
		var a = p.processBulk([makeEvent(),makeEvent()]);
		
		expect(a.length).to.equal(4);
		expect(a[0].index._index).to.equal('mail-2013.10.03');
		expect(a[0].index._type).to.equal('log');
		expect(a[2].index._index).to.equal('mail-2013.10.03');
		expect(a[3]).to.deep.equal(p.processEvent(makeEvent()));
	});
	
	it('should reject non-arrays',()=>{
		expect(()=>{
			var a = p.processBulk('mango');
		}).to.throw(Error);
		expect(()=>{
			var a = p.processBulk(100);
		}).to.throw(Error);
		expect(()=>{
			var a = p.processBulk({mango:'jango'});
		}).to.throw(Error);
	});
});
