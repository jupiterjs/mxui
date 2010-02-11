//js menu/compress.js

var compressPage = 'menu/menu.html';
var outputFolder = 'menu';
load("steal/compress/compress.js")
var compress = new Steal.Compress([compressPage, outputFolder]);
compress.init();