var url = require("url");
var fs = fs || require('fs'),
    files = fs.readdirSync("./photos/");
var path = require('path');

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomNumbers(size) {
	var lindex = new Array(size);
	for (var i = 0; i < size; i++) {
		var newRand = getRandomInt(0, files.length - 1);
		lindex[i] = newRand;
		for (var l in lindex) {
			if (newRand == l) {
				i--;
				break;
			}
		}		
	}
    return lindex;
}

function getRandImages(len) {
  var u = randomNumbers(len);
  console.log(u);
  var res = [];
  for (var i = 0; i < len; i++) {
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
