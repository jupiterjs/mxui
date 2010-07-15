// usage: steal\js -mail phui/grid\scripts\test_and_email.js

if (typeof javax.mail.Session.getDefaultInstance != "function") {
	print('usage: steal\\js -mail phui/grid\\scripts\\test_and_email.js')
	quit()
}

load('phui/grid/test/settings.js')
load('steal/email/email.js');

if (java.lang.System.getProperty("os.name").indexOf("Windows") != -1) {
	runCommand("cmd", "/C", "start /b steal\\js phui/grid/scripts/funcunit.js > phui/grid/test.log")
	runCommand("cmd", "/C", "start /b steal\\js phui/grid/scripts/qunit.js >> phui/grid/test.log")
}
else {
	runCommand("sh", "-c", "nohup ./steal/js phui/grid/scripts/funcunit.js > phui/grid/test.log")
	runCommand("sh", "-c", "nohup ./steal/js phui/grid/scripts/qunit.js >> phui/grid/test.log")
}

var log = readFile('phui/grid/test.log');
Emailer.setup(EmailerDefaults);
Emailer.send(log)