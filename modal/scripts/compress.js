//js phui/modal/compress.js

load("steal/compress/compress.js")
var compress = new Steal.Compress(['phui/modal/modal.html',
                                   'phui/modal']);
compress.init();