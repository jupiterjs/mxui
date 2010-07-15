load('steal/rhino/env.js');
load('phui/menuable/selectopen/settings.js')

if (!_args[0] || (_args[0]!="-functional" && _args[0]!="-unit" && _args[1]!="-email" && _args[1]!="-mail")) {
	print("Usage: steal/js phui/menuable/selectopen/scripts/test.js [option]");
	print("");
	print("options");
	print("-functional 	Runs funcunit tests");
	print("-unit 		Runs unit tests");
	print("-email 		Runs all tests and emails you results");
	quit();
}

if (_args[0] == "-functional") {
	Envjs('phui/menuable/selectopen/funcunit.html', {
		scriptTypes: {
			"text/javascript": true,
			"text/envjs": true
		},
		fireLoad: true,
		logLevel: 2
	});
}

if (_args[0] == "-unit") {
	Envjs('phui/menuable/selectopen/qunit.html', {
		scriptTypes: {
			"text/javascript": true,
			"text/envjs": true
		},
		fireLoad: true,
		logLevel: 2
	});
}

if(_args[1] == "-email" || _args[1] == "-mail"){
	if (typeof javax.mail.Session.getDefaultInstance != "function") {
		print('usage: steal\\js -mail phui/menuable/selectopen/scripts/test.js -email')
		quit()
	}
	load('steal/email/email.js');
	
	if (java.lang.System.getProperty("os.name").indexOf("Windows") != -1) {
		runCommand("cmd", "/C", "start /b steal\\js phui/menuable/selectopen/scripts/test.js -functional > phui/menuable/selectopen/test.log")
		runCommand("cmd", "/C", "start /b steal\\js phui/menuable/selectopen/scripts/test.js -unit >> phui/menuable/selectopen/test.log")
	}
	else {
		runCommand("sh", "-c", "nohup ./steal/js phui/menuable/selectopen/scripts/test.js -functional > phui/menuable/selectopen/test.log")
		runCommand("sh", "-c", "nohup ./steal/js phui/menuable/selectopen/scripts/test.js -unit >> phui/menuable/selectopen/test.log")
	}
	
	var log = readFile('phui/menuable/selectopen/test.log');
	steal.Emailer.setup(EmailerDefaults);
	steal.Emailer.send(log)
}