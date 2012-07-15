var remote_couch = sag.server('localhost', '80');
remote_couch.setPathPrefix('/remote_couchdb/');
remote_couch.login({
	 user: 'admin',
     pass: 'shinobi2'
})
remote_couch.setDatabase("sets");
remote_couch.post({data:{herp:"derp"}})
