//js phui/widget/state_indicator/compress.js

load("steal/compress/compress.js")
var compress = new Steal.Compress(['phui/widget/state_indicator/state_indicator.html',
                                   'phui/widget/state_indicator']);
compress.init();