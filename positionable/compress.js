//js positionable/compress.js

var compressPage = 'positionable/positionable.html';
var outputFolder = 'positionable';
load("jmvc/compress/compress.js")
var compress = new Steal.Compress([compressPage, outputFolder]);
compress.init();