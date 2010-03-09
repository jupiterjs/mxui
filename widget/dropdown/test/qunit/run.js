load('steal/rhino/env.js');
Envjs('dropdown/test/qunit/test.html', {
	scriptTypes : {"text/javascript" : true,"text/envjs" : true}, 
	fireLoad: true, 
	logLevel: 2
});