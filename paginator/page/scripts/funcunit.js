load('phui/paginator/page/test/settings.js')
load('steal/rhino/env.js');

Envjs('phui/paginator/page/funcunit.html', 
	{scriptTypes : {"text/javascript" : true,"text/envjs" : true}, 
	fireLoad: true, 
	logLevel: 2
});