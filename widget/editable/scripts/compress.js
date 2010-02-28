//js phui/widget/editable/compress.js

load("steal/compress/compress.js")
var compress = new Steal.Compress(['phui/widget/editable/editable.html',
                                   'phui/widget/editable']);
compress.init();