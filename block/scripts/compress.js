//js phui/block/compress.js

load("steal/compress/compress.js")
var compress = new Steal.Compress(['phui/block/block.html',
                                   'phui/block']);
compress.init();