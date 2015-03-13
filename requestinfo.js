var url = require("url");
var fs = fs || require('fs');
var path = require('path');
var currDir = "", files = [];

function getDirs(rootDir) {
    var allFiles = fs.readdirSync(rootDir);
    var dirs = [];
		
    for (var i = 0; i < allFiles.length; ++i) {
		var file = allFiles[i];
        if (file.substring(0, 6) == "group_") {
            var filePath = rootDir + file;
            var stat = fs.statSync(filePath);
		
            if (stat.isDirectory()) {
                dirs.push(file);
			}
		}
	}
    return dirs
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

var allDirs = getDirs("./photos/");
function getNextList() {
	if (currDir != "") {
		allDirs.push(currDir);
	}
	currDir = allDirs.pop();
	files = fs.readdirSync("./photos/" + currDir);
	shuffleArray(files);
}
getNextList();

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
  /*var u = randomNumbers(len);
  console.log(u);
  var res = [];
  for (var i = 0; i < len; i++) {
	res.push(path.normalize("/photos/" + files[u[i]]));
  }
  return res;*/
  
  while (files.length < len) {
	getNextList();
  }
  var res = [];
  for (var i = 0; i < 2; ++i) {
	fname = files.pop();
	res.push("./photos/" + fname);
	fname = fname.substring(0, fname.length - 4);
	res.push("./photos/" + fname + "_hist.png");
  }
  for (var i = 0; i < len; ++i) {
	res.push("./photos/" + files.pop());
  }
  return res;
} 

function getPath(request) {  
  var path = url.parse(request.url).pathname;    
  return path;
}

exports.getRandImages = getRandImages;
exports.getPath = getPath;
