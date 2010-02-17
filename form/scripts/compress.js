//js phui/form/compress.js

load("steal/compress/compress.js")
var compress = new Steal.Compress(['phui/form/form.html',
                                   'phui/form']);
compress.init();