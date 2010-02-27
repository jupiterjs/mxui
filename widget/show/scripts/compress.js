//js phui/widget/show/compress.js

load("steal/compress/compress.js")
var compress = new Steal.Compress(['phui/widget/show/show.html',
                                   'phui/widget/show']);
compress.init();