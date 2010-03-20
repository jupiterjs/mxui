load('phui/datatable/test/settings.js')
load('steal/rhino/env.js');

Envjs('phui/datatable/funcunit.html', 
	{scriptTypes : {"text/javascript" : true,"text/envjs" : true}, 
	fireLoad: true, 
	logLevel: 2
});