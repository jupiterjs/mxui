//steal/js mxui/grid/scripts/gridfiller/scripts/compress.js

load("steal/rhino/steal.js");
steal.plugins('steal/build','steal/build/scripts','steal/build/styles',function(){
	steal.build('mxui/grid/scripts/gridfiller/scripts/build.html',{to: 'mxui/grid/scripts/gridfiller'});
});
