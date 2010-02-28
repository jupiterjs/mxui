//js phui/widget/textarea/compress.js

load("steal/compress/compress.js")
var compress = new Steal.Compress(['phui/widget/textarea/textarea.html',
                                   'phui/widget/textarea']);
compress.init();