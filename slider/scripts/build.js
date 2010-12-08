//steal/js mxui/slider/scripts/compress.js

load("steal/rhino/steal.js");
steal.plugins('steal/build','steal/build/scripts','steal/build/styles',function(){
	steal.build('mxui/slider/scripts/build.html',{to: 'mxui/slider'});
});
