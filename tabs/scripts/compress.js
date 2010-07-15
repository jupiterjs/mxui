//js phui/tabs/compress.js

load("steal/compress/compress.js")
var compress = new Steal.Compress(['phui/tabs/tabs.html',
                                   'phui/tabs']);
compress.init();