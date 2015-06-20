var url = require("url");
var fs = fs || require('fs');
var path = require('path');
var currDir, files;
var allDirs;


// Resets a session. 
function resetAll(dir, suffix) {
	console.log("* NodeJS resets *");
	currDir = "";
	files = [];
	dirI = 0;
	allDirs = getDirs(dir, suffix);
}

// Lists all groups in photos folder
function getDirs(rootDir, suffix) {
    var allFiles = fs.readdirSync(rootDir);
    var dirs = [];
		
    for (var i = 0; i < allFiles.length; ++i) {
		var file = allFiles[i];
        if (file.substring(0, 6) == suffix) {
            var filePath = rootDir + file;
            var stat = fs.statSync(filePath);
		
            if (stat.isDirectory()) {
                dirs.push(file);
			}
		}
	}
    return dirs
}

// General shuffle function
function shuffleArray(array, from, len) {
    for (var i = len - from; i >= 0; i--) {
        var j = Math.floor(Math.random() * (i + 1) + from);
        var temp = array[i + from];
        array[i + from] = array[j];
        array[j] = temp;
    }
    return array;
}

// Get next group
function getNextList(dir, skip, len, dirI) {
	if (dirI >= allDirs.length || dirI < 0) {
		return;
	}
	currDir = allDirs[dirI];
	files = fs.readdirSync(dir + currDir);
	shuffleArray(files, skip, len);
}

// Random integer in a range helper function
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Count image  sources (correlates to number of sections)
function countSources(dir, suffix) {
	var allFiles = fs.readdirSync(dir);
    var allSrcs = {};
	var cntGroups = 0;
		
    for (var i = 0; i < allFiles.length; ++i) {
		var file = allFiles[i];
		var name = file.substring(0, 4);
        if (name == "src_") {
			idx = file.split("_")[1];
            allSrcs[idx] = file;
		} else if (name == suffix.substring(0, 4)) {
			++cntGroups;
		}
	}
	return {srcs: allSrcs, grps :cntGroups};
}

// Get N number of random images from a page (next group)
function getRandImages(dir, len, page) {
	page = page - 1;
	len = parseInt(len);
	getNextList(dir, 7, len, page);
	var toRemove = [];
	var res = [];
	res.length = len + 7;
	res[0] = dir + currDir + '/';
	res[1] = files[4];
	res[2] = files[5];
	res[3] = files[2];
	res[4] = files[3];
	res[5] = files[0];
	res[6] = files[1];

	for (var i = 7; i < len + 7; ++i) {
		res[i] = files[i];
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
