//steal/js phui/fittable/scripts/compress.js

load("steal/rhino/steal.js");
steal.plugins('steal/clean',function(){
	steal.clean('phui/fittable/fittable.html',{indent_size: 1, indent_char: '\t'});
});
