//js phui/resizable/compress.js

load("steal/compress/compress.js")
var compress = new Steal.Compress(['phui/resizable/resizable.html',
                                   'phui/resizable']);
compress.init();