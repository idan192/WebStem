var url = require("url");
var fs = fs || require('fs'),
    files = fs.readdirSync("./photos/");
var path = require('path');

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomNumbers(size) {
	var lindex = [];
	for (var i = 0; i < 7; i++) {
		var newRand = getRandomInt(0, size - 1);
		for (var l in lindex) {
			if (newRand == l) {
				i--;
				continue;
			}
		}
		lindex.push(newRand);
	}
    return lindex;
}

function getRandImages() {
  var len = files.length;
  var u = randomNumbers(len);
  console.log(u);
  var res = [];
  for (var i = 0; i < u.length; i++) {
	res.push(path.normalize("/photos/" + files[u[i]]));
  }
  return res;
} 

function getPath(request) {  
  var path = url.parse(request.url).pathname;    
  return path;
}

exports.getRandImages = getRandImages;
exports.getPath = getPath;
