//js phui/filler/compress.js

load("steal/compress/compress.js")
var compress = new Steal.Compress(['phui/filler/filler.html',
                                   'phui/filler']);
compress.init();