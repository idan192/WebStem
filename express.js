var express = require('express');
var fs = require('fs');
var http = require('http');
var path = require('path');
var info = require('./requestinfo');
var bodyParser = require('body-parser');

var app = express();
var server = http.createServer(app);

var ismain = __dirname.indexOf("-MAIN") > -1;
var port = ismain ? 8080 : 8081;
var url  = 'http://localhost:' + port + '/';
var randImages = [];
var logFiles = {};

console.log("Main service: " + ismain);
server.listen(port);
console.log(url);

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

function fileWriter(fileName, text) {
	/*var log = logFiles[fileName];
	if (log == undefined) {
		log = fs.createWriteStream(fileName, {'flags': 'a'});
		logFiles[fileName] = log;
	}
	log.once('drain', text);
	*/
	fs.appendFileSync(fileName, text);
}

app.post('/data', function(req, res) {
	var user = req.body.user;
	var logF = req.body.log;
	var filePath = "triplets/triplets_page_" + logF + ".log";
	
	//console.log("======================");
	var isSubmit = req.body.isSubmit;
	if (isSubmit == "true") {		
		var comment = req.body.comm;
		fileWriter(filePath, "Submitted by " + user + ":\t" + comment + "\n*******************************\n\n");
		//console.log(filePath + ":\n\tSubmitted:\t" + comment + "\n");
	} else {
		var mark = req.body.mark;
		var src = req.body.src;
		var msg = getDateTime() + "\tImage by " + user + ":\t" + src + "\t" + mark;
		fileWriter(filePath, msg + "\n");
		//console.log(filePath + ":\n\t" + msg + "\n");
	}
	res.end();
});

app.get('/newUser', function(req, res) {
    user = req.query.user;
	var time = getDateTime();
	var countData = info.countSources();
	
	//info.resetAll();
	response = user + "_" + time;
	res.send({user: response, srcs: countData.srcs, grps: countData.grps});
});

app.get('/', function (req, res) {
    //console.log(__dirname);
	info.resetAll();
    res.sendFile(__dirname + path.normalize('/index.html'));
});

app.get('/newImage', function (req, res) {
    randImages = info.getRandImages(req.query.num, req.query.page);
    res.send(randImages);
});

app.get('/gallery', function (req, res) {
	res.writeHead(302, {
	  'Location': '/PhotoFloat/web/index.html'
	});
	res.end();
});

app.get('/reset', function(req, res){
	info.resetAll();
	
	res.writeHead(302, {
	  'Location': '/'
	});
	res.end();
});

app.get('/*', function (req, res) {
    //console.log(info.getPath(req));
    res.sendFile(__dirname + path.normalize(info.getPath(req)));
});


