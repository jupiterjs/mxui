//steal/js phui/fittable/scripts/compress.js

load("steal/rhino/steal.js");
steal.plugins('steal/build','steal/build/scripts','steal/build/styles',function(){
	steal.build('phui/fittable/fittable.html',{to: 'phui/fittable'});
});
