//js phui/model_hookup/compress.js

load("steal/compress/compress.js")
var compress = new Steal.Compress(['phui/model_hookup/model_hookup.html',
                                   'phui/model_hookup']);
compress.init();