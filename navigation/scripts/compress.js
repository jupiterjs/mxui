//js jupiter/navigation/compress.js

var compressPage = 'jupiter/navigation/navigation.html';
var outputFolder = 'jupiter/navigation';
load("steal/compress/compress.js")
var compress = new Steal.Compress([compressPage, outputFolder]);
compress.init();