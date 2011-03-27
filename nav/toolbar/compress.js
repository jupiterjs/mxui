//js toolbar/compress.js

var compressPage = 'toolbar/toolbar.html';
var outputFolder = 'toolbar';
load("steal/compress/compress.js")
var compress = new Compress([compressPage, outputFolder]);
compress.init();