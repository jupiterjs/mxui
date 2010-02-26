//js phui/widget/compress.js

load("steal/compress/compress.js")
var compress = new Steal.Compress(['phui/widget/widget.html',
                                   'phui/widget']);
compress.init();