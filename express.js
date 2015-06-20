var express = require('express');
var fs = require('fs');
var http = require('http');
var path = require('path');
var info = require('./requestinfo');
var bodyParser = require('body-parser');
var photoFolder = "./photos/";
var suffix = "group_";

// Main folder gets port 8080, otherwise gets 8081
var ismain = __dirname.indexOf("-MAIN") > -1;
var port = ismain ? 8080 : 8081;

var app = express();
var server = http.createServer(app);

if (!String.prototype.startsWith) {
  String.prototype.startsWith = function(searchString, position) {
    position = position || 0;
    return this.indexOf(searchString, position) === position;
  };
}

// print process.argv
process.argv.forEach(function (val, index, array) {
	if (index < 2) {
		return;
	}
	str = val.replace(/\s+/g, '');
	if (str == "-h") {
		console.log("./node express.js <-h> <port=num> <photoDir=loc> <suffix=str>");
		process.exit();
	}
	else if (str.startsWith("port=")) {
		port = str.split("=")[1];
	}
	else if (str.startsWith("photoDir=")) {
		photoFolder = str.split("=")[1] + "/";
	}
	else if (str.startsWith("suffix=")) {
		suffix = str.split("=")[1];
	}
	else {
		console.log("Unknown argument: " + val);
	}
});

var url  = 'http://localhost:' + port + '/';
var randImages = [];
var logFiles = {};
console.log("Main service: " + ismain);
server.listen(port);
console.log(url);

// Date and time to string generator
function getDateTime() {
    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + month + day + "T" + hour + min + sec;
}

app.use(bodyParser.urlencoded({extend: false}));

// Append to file wrapper
function fileWriter(fileName, text) {
	fs.appendFileSync(fileName, text);
}

// Logger of action vs. submission
app.post('/data', function(req, res) {
	var user = req.body.user;
	var logF = req.body.log;
	var filePath = "triplets/triplets_page_" + logF + ".log";
	
	var isSubmit = req.body.isSubmit;
	if (isSubmit == "true") {		
		var comment = req.body.comm;
		fileWriter(filePath, "Submitted by " + user + ":\t" + comment + "\n*******************************\n\n");
	} else {
		var mark = req.body.mark;
		var src = req.body.src;
		var msg = getDateTime() + "\tImage by " + user + ":\t" + src + "\t" + mark;
		fileWriter(filePath, msg + "\n");
	}
	res.end();
});

// New use gets new stack of images and data
app.get('/newUser', function(req, res) {
    user = req.query.user;
	var time = getDateTime();
	var countData = info.countSources(photoFolder, suffix);
	response = user + "_" + time;
	res.send({user: response, srcs: countData.srcs, grps: countData.grps});
});

// Main url - just show index.html
app.get('/', function (req, res) {
	info.resetAll(photoFolder, suffix);
    res.sendFile(__dirname + path.normalize('/index.html'));
});

// GET of new images
app.get('/newImage', function (req, res) {
    randImages = info.getRandImages(photoFolder, req.query.num, req.query.page);
    res.send(randImages);
});

// Misc gallery
app.get('/gallery', function (req, res) {
	res.writeHead(302, {
	  'Location': '/PhotoFloat/web/index.html'
	});
	res.end();
});

// Resets all data (in case groups change)
app.get('/reset', function(req, res){
	info.resetAll(photoFolder, suffix);
	
	res.writeHead(302, {
	  'Location': '/'
	});
	res.end();
});

// Any other case - just try accessing that path
app.get('/*', function (req, res) {
    res.sendFile(__dirname + path.normalize(info.getPath(req)));
});


