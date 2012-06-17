var couch = sag.server('localhost', '80');
couch.setPathPrefix('/couchdb/');
couch.login({
	 user: 'admin',
     pass: 'shinobi2'
})
