load('phui/widget/dropdown/test/funcunit/settings.js')
load('steal/rhino/env.js');

Envjs('phui/widget/dropdown/funcunit.html', 
	{scriptTypes : {"text/javascript" : true,"text/envjs" : true}, 
	fireLoad: true, 
	logLevel: 2
});