//js phui/menu/compress.js

load("steal/compress/compress.js")
var compress = new Steal.Compress(['phui/menu/menu.html',
                                   'phui/menu']);
compress.init();