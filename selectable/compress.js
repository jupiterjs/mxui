//js selectable/compress.js

var compressPage = 'selectable/selectable.html';
var outputFolder = 'selectable';
load("jmvc/compress/compress.js")
var compress = new Steal.Compress([compressPage, outputFolder]);
compress.init();