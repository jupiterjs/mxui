//js mxui/filemanager/scripts/doc.js

load('steal/rhino/steal.js');
steal.plugins("documentjs").then(function(){
	DocumentJS('mxui/filemanager/filemanager.html');
});