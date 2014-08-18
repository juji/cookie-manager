var sCook = require('simple-cookie');
var urlParse = require('url');

function arrayUnique( arr ){
	var f = [];
	var s = [];
	for(var i in arr){
		var g = JSON.stringify(arr[i]);
		if( f.indexOf( g ) == -1 ) {
			s.push( arr[i] );
			f.push(g);
		}
	}

	return s;
}

var cookie = function(){

	this.domains = [];
	this.domainReg = [];
	this.list = {};
	this.length = 0;

}

cookie.prototype.store = function( url, cook ){

	var u = urlParse.parse(url);

	if(typeof cook == 'string' ) cook = [ cook ];
	var t = this;
	for(var i in cook){
		(function(){
			var objs = sCook.parse( cook[i], u.pathname, u.hostname );
			objs.pathReg = new RegExp( '^'+objs.path );

			if ( t.domains.indexOf( objs.domain ) > -1 ){
				t.list[ objs.domain ][ objs.name ] = objs;
			}else{
				t.list[ objs.domain ] = {};
				t.list[ objs.domain ][ objs.name ] = objs;

				t.domains.push( objs.domain );
				var reg = objs.domain.match(/^\./) ? objs.domain+'$' : '^'+objs.domain+'$';
				t.domainReg.push( new RegExp(reg) );
			}
		})();
	}

	//calculate length
	this.length = 0;
	for(var i in t.list){
		for(var j in t.list[i]) this.length++;
	}

};

cookie.prototype.search = function( domain, path, date, browser, secure){

	var f = [];
	for(var i in this.domainReg){
		if( !this.domainReg[i].test(domain) ) continue;
		for(var j in this.list[ this.domains[i] ] )
		f.push( this.list[ this.domains[i] ][j] );
	}

	if( typeof date == 'string' ) date = new Date(date);
	date = date.valueOf();

	path = (path ? path : '/').replace(/\?.*$/,'').replace(/\#.*$/,'');

	var g = [];
	for(var i in f){
		if( 
			f[i].pathReg.test(path) &&
			(!f[i].expires || date < f[i].expires.valueOf()) &&
			!( browser && f[i].httponly ) &&
			!( !secure && f[i].secure )
		) g.push(f[i]);
	};

	return g;

};

cookie.prototype.tokenize = function( arr ){
	
	return sCook.tokenize( arrayUnique( arr ) );

};

cookie.prototype.prepare = function( url, browser ){

	var u = urlParse.parse(url);
	var d = new Date();
	return this.tokenize( this.search( 
		u.hostname, 
		u.pathname, 
		d, 
		browser, 
		u.protocol == 'https:' 
	).concat(
		this.search( 
			'.'+u.hostname, 
			u.pathname, 
			d, 
			browser, 
			u.protocol == 'https:' 
		)
	) );

}

module.exports = exports = cookie;