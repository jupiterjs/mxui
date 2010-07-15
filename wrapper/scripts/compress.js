//js phui/wrapper/compress.js

load("steal/compress/compress.js")
var compress = new Steal.Compress(['phui/wrapper/wrapper.html',
                                   'phui/wrapper']);
compress.init();