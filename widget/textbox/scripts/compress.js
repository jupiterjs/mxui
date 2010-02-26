//js phui/widget/textbox/compress.js

load("steal/compress/compress.js")
var compress = new Steal.Compress(['phui/widget/textbox/textbox.html',
                                   'phui/widget/textbox']);
compress.init();