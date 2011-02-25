//steal/js mxui/filemanager/scripts/compress.js

load("steal/rhino/steal.js");
steal.plugins('steal/build','steal/build/scripts','steal/build/styles',function(){
	steal.build('mxui/filemanager/scripts/build.html',{to: 'mxui/filemanager'});
});
