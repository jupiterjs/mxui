//js phui/splitter/compress.js

load("steal/compress/compress.js")
var compress = new Steal.Compress(['phui/splitter/splitter.html',
                                   'phui/splitter']);
compress.init();