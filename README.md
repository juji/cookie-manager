#cookie-manager

cookie manager for any http client in node.js

##install
```javascript
npm install cookie-manager
```


##Usage
```javascripot
var CM = require('cookie-manager');
var cm = new CM();
```

###Storing Cookies
```javascript
// Hey, i just requested https://example.com/is/cool
// the website sent me some cookies to set. please store these cookies...
//

cm.store( 
	'https://example.com/is/cool', 
	'cname=cval; Expires=someDate; domain=.example.com; path=/' 
);

cm.store( 
 'https://example.com/is/cool', 
 [
  'cnameSecure=cval1sec; Expires=someDate; domain=.example.com; path=/; secure',
  'cnameHttpOnly=cval1Http; Expires=someDate; domain=.example.com; path=/; HttpOnly',
  'cnameWWW=cvalWWW; Expires=someDate; domain=www.example.com; path=/something'
 ]
);
```

###Prepare Cookies for request
```javascript
// Hey, i want to browse http://example.com/ Please prepare the cookies
cookies = cm.prepare( 'http://example.com' );
// 'cname=cval; cnameHttpOnly=cval1Http'
```
```javascript
// Hey, i want to browse http://cool.example.com/ Please prepare the cookies
cookies = cm.prepare( 'http://cool.example.com' );
// 'cname=cval; cnameHttpOnly=cval1Http'
```
```javascript
// Hey, i want to browse http://www.example.com/something/awesome Please prepare the cookies
cookies = cm.prepare( 'http://www.example.com/something/awesome' );
// 'cname=cval; cnameHttpOnly=cval1Http; cname2=cval2'
```
```javascript
// Hey, i'm trying to request https://www.example.com/something/awesome
cookies = cm.prepare( 'https://www.example.com/something/awesome' )
// 'cname=cval; cnameSecure=cval1sec; cnameHttpOnly=cval1Http; cname2=cval2'
```
```javascript
// Hey, i want to browse http://www.example.com/other/stuff Please prepare the cookies
cookies = cm.prepare( 'http://www.example.com/other/stuff' );
// 'cname=cval; cnameHttpOnly=cval1Http'
```

###For Browser emulation
```javascript
this.document.cookie = cm.prepare( 
							'http://www.example.com/something/awesome', 
							true 
						);

// cname=cval; cname2=cval2
```

###For Time Travelers
```javascript
// Hey, i traveled 500 years in time, 
// and i want to browse http://www.example.com/something/awesome
// again.
//
cm.prepare( 'http://www.example.com/something/awesome' );
// empty string.. the cookies have expired.
```

cheers,

[jujiyangasli.com](http://jujiyangasli.com)