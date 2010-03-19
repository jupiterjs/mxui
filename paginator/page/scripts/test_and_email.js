// usage: steal\js -mail phui/paginator/page\scripts\test_and_email.js

if (typeof javax.mail.Session.getDefaultInstance != "function") {
	print('usage: steal\\js -mail phui/paginator/page\\scripts\\test_and_email.js')
	quit()
}

load('phui/paginator/page/test/settings.js')
load('steal/email/email.js');

if (java.lang.System.getProperty("os.name").indexOf("Windows") != -1) {
	runCommand("cmd", "/C", "start /b steal\\js phui/paginator/page/scripts/funcunit.js > phui/paginator/page/test.log")
	runCommand("cmd", "/C", "start /b steal\\js phui/paginator/page/scripts/qunit.js >> phui/paginator/page/test.log")
}
else {
	runCommand("sh", "-c", "nohup ./steal/js phui/paginator/page/scripts/funcunit.js > phui/paginator/page/test.log")
	runCommand("sh", "-c", "nohup ./steal/js phui/paginator/page/scripts/qunit.js >> phui/paginator/page/test.log")
}

var log = readFile('phui/paginator/page/test.log');
Emailer.setup(EmailerDefaults);
Emailer.send(log)