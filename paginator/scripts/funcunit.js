load('archer/ui/paginator/test/settings.js')
load('steal/rhino/env.js');

Envjs('archer/ui/paginator/funcunit.html', 
	{scriptTypes : {"text/javascript" : true,"text/envjs" : true}, 
	fireLoad: true, 
	logLevel: 2
});