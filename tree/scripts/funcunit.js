load('phui/tree/test/settings.js')
load('steal/rhino/env.js');

Envjs('phui/tree/funcunit.html', 
	{scriptTypes : {"text/javascript" : true,"text/envjs" : true}, 
	fireLoad: true, 
	logLevel: 2
});