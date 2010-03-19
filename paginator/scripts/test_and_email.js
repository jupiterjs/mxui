// usage: steal\js -mail archer/ui/paginator\scripts\test_and_email.js

if (typeof javax.mail.Session.getDefaultInstance != "function") {
	print('usage: steal\\js -mail archer/ui/paginator\\scripts\\test_and_email.js')
	quit()
}

load('archer/ui/paginator/test/settings.js')
load('steal/email/email.js');

if (java.lang.System.getProperty("os.name").indexOf("Windows") != -1) {
	runCommand("cmd", "/C", "start /b steal\\js archer/ui/paginator/scripts/funcunit.js > funcunit/test.log")
	runCommand("cmd", "/C", "start /b steal\\js archer/ui/paginator/scripts/qunit.js >> funcunit/test.log")
}
else {
	print("not yet implemented");
	quit();
}

var log = readFile('archer/ui/paginator/test.log');
Emailer.setup(EmailerDefaults);
Emailer.send(log)