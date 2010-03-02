//js phui/widget/group_editable/compress.js

load("steal/compress/compress.js")
var compress = new Steal.Compress(['phui/widget/group_editable/group_editable.html',
                                   'phui/widget/group_editable']);
compress.init();