var Cookie = require('../');
var q = require('q');
var should = require('chai').should();

var cm = new Cookie();
var date = (new Date((new Date()).valueOf() + 3000)).toGMTString();

cm.store( 
	'https://example.com/is/cool', 
	'cname=cval; Expires='+date+'; domain=.example.com; path=/' 
);

cm.store( 
	'https://example.com/is/cool', 
	[
		'cnameSecure=cval1sec; Expires='+date+'; domain=.example.com; path=/; secure',
		'cnameHttpOnly=cval1Http; Expires='+date+'; domain=.example.com; path=/; HttpOnly',
		'cname2=cval2; Expires='+date+'; domain=www.example.com; path=/something'
	]
);

describe('Cookie-manager',function(){

	describe('#data',function(){
		it('Should not be empty',function(){

			cm.length.should.equal(4);
			cm.domains.length.should.equal(2);
			cm.domainReg.length.should.equal(2);
			cm.list['.example.com'].cname.should.be.ok;
			cm.list['www.example.com'].cname2.should.be.ok;

			return true;
		});
	});

	describe('#now',function(){
		it('Should return correct cookie string',function(){
			
			console.log('	http://example.com');
			cm.prepare( 'http://example.com' ).should
			.equal('cname=cval; cnameHttpOnly=cval1Http');

			console.log('	http://cool.example.com');
			cm.prepare( 'http://cool.example.com' ).should
			.equal('cname=cval; cnameHttpOnly=cval1Http');

			console.log('	http://www.example.com/something/awesome');
			cm.prepare( 'http://www.example.com/something/awesome' )
			.should.equal('cname=cval; cnameHttpOnly=cval1Http; cname2=cval2');

			console.log('	https://www.example.com/something/awesome');
			cm.prepare( 'https://www.example.com/something/awesome' )
			.should.equal('cname=cval; cnameSecure=cval1sec; cnameHttpOnly=cval1Http; cname2=cval2');

			console.log('	http://www.example.com/other/stuff');
			cm.prepare( 'http://www.example.com/other/stuff' )
			.should.equal('cname=cval; cnameHttpOnly=cval1Http');

			console.log('	http://www.example.com/something/awesome >> browser');
			cm.prepare( 'http://www.example.com/something/awesome', true )
			.should.equal('cname=cval; cname2=cval2');

			return true;
		});
	});

	describe('#another-host',function(){
		it('Should return nothing',function(){
			return cm.prepare( 'http://cool.asdf.com' ).should.not.be.ok;
		});
	});

	describe('#5-seconds-later',function(){

		this.timeout(6000);
		it('Should return nothing',function(){

			var d = q.defer();
			setTimeout(function(){
				d.resolve( cm.prepare( 'http://cool.example.com' ).should.not.be.ok );
			},5000);
			return d.promise;
		});

	});
	
	
});