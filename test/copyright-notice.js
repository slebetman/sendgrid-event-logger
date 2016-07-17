var chai = require('chai');
var expect = chai.expect;
var fs = require('fs');

var libpath = __dirname + '/../lib/';

describe('copyright-notice',()=>{

	it('should ensure all lib files have copyright notice',()=>{
		var files_with_no_copyright_notice = fs.readdirSync(libpath)
			.filter((x)=>{return x.match(/\.js$/)})
			.map((x)=>{
				if (
					fs.readFileSync(libpath + x,'utf8')
						.match(/Copyright(.|\n)*GNU General Public License/)
				) {
					return null;
				}
				return x;
			})
			.filter((x)=>{return x});
		
		expect(files_with_no_copyright_notice).to.deep.equal([]);
	});

});