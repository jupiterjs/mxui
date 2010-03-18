load('phui/grid/test/settings.js')
load('steal/rhino/env.js');

Envjs('phui/grid/funcunit.html', 
	{scriptTypes : {"text/javascript" : true,"text/envjs" : true}, 
	fireLoad: true, 
	logLevel: 2
});