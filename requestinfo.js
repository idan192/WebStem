var url = require("url");
var fs = fs || require('fs');
var path = require('path');
var currDir, files;
//var dirI;
var allDirs;
resetAll();

function resetAll() {
	console.log("* NodeJS resets *");
	currDir = "";
	files = [];
	dirI = 0;
	allDirs = getDirs("./photos/");
	//console.log(allDirs);
	//getNextList();
}

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

function shuffleArray(array, from, len) {
    for (var i = len - from; i >= 0; i--) {
        var j = Math.floor(Math.random() * (i + 1) + from);
        var temp = array[i + from];
        array[i + from] = array[j];
        array[j] = temp;
    }
    return array;
}

function getNextList(skip, len, dirI) {
    //dirI = getRandomInt(0, allDirs.length - 1);
	if (dirI >= allDirs.length || dirI < 0) {
		return;
	}
	currDir = allDirs[dirI];
	files = fs.readdirSync("./photos/" + currDir);
	//console.log(files);
	shuffleArray(files, skip, len);
	//dirI = (dirI + 1) % allDirs.length;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function countSources() {
	var allFiles = fs.readdirSync("./photos/");
    var allSrcs = [];
	var cntGroups = 0;
		
    for (var i = 0; i < allFiles.length; ++i) {
		var file = allFiles[i];
		var name = file.substring(0, 4);
        if (name == "src_") {
            allSrcs.push(file);
		} else if (name == "grou") {
			++cntGroups;
		}
	}
	return {srcs: allSrcs, grps :cntGroups};
}

function randomNumbers(size) {
	var lindex = new Array(size);
	for (var i = 0; i < size; i++) {
		var newRand = getRandomInt(0, files.length - 1);
		if (newRand in lindex) {
		    i--;
		} else {
			lindex[i] = newRand;
		}
	}
    return lindex;
}

function getRandImages(len, page) {
	page = page - 1;
	len = parseInt(len);
	getNextList(6, len, page);
	var toRemove = [];
	var res = [];
	res.length = len + 7;
	res[0] = './photos/' + currDir + '/';
	res[1] = files[4];
	res[2] = files[5];
	res[3] = files[2];
	res[4] = files[3];
	res[5] = files[0];
	res[6] = files[1];
			 
	for (var i = 6; i < len + 6; ++i) {
		res[i + 1] = files[i];
	}
	return res;
} 

function getPath(request) {  
  var path = url.parse(request.url).pathname;    
  return path;
}

exports.getRandImages = getRandImages;
exports.getPath = getPath;
exports.resetAll = resetAll;
exports.countSources = countSources;
