var express = require('express');
var fs = require('fs');
var http = require('http');
var path = require('path');
var info = require('./requestinfo')
var bodyParser = require('body-parser')

var app = express();
var server = http.createServer(app);

var port = 8080;
var url  = 'http://localhost:' + port + '/';
var randImages = [];

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

app.post('/data', function(req, res){
	log = req.body.log;
    red = req.body.red;
	blue = req.body.blue;
	redmatched = req.body.mreds;
	bluematched = req.body.mblues;
	unmatched = req.body.no;
	logger = req.body.logging;
	comment = req.body.comm;

	// {template:/photos/43.png, matched:[....], unmatched:[....]}
	jsonStr = "{\"template 1\": " + red + "\", template 2\": " + blue + ", \"red-matched\": [" + 
				redmatched + "]"  + ", \"blue-matched\": [" + bluematched + "], \"unmatched\": [" + unmatched + "]}\n";
	fs.appendFile('triplets/triplets_' + log + '.json', jsonStr); 
	fs.appendFile('triplets/triplets_' + log + '.log', logger + ", Comment: " + comment + "\n");

	for (var r in redmatched) {
		for (var b in bluematched) {
			str = red + ", " + redmatched[r] + ", " + bluematched[b] + "\n";
			fs.appendFile('triplets/triplets_' + log + '.csv', str);
		}
	}
	
	for (var b in bluematched) {
		for (var r in redmatched) {
			str = blue + ", " + bluematched[b] + ", " + redmatched[r] + "\n";
			fs.appendFile('triplets/triplets_' + log + '.csv', str);
		}
	}
});

app.get('/newUser', function(req, res) {
    user = req.query.user;
	var time = getDateTime();
	
	response = user + "_" + time;
	console.log("New user: " + response);
	res.send(response);
});

app.get('/', function (req, res) {
    console.log(__dirname);
    res.sendFile(__dirname + path.normalize('/index.html'));
});

app.get('/newImage', function (req, res) {
    randImages = info.getRandImages(req.query.num);
    res.send(randImages);
});

app.get('/gallery', function (req, res) {
	res.writeHead(302, {
	  'Location': '/PhotoFloat/web/index.html'
	});
	res.end();
});

app.get('/*', function (req, res) {
    console.log(info.getPath(req));
    res.sendFile(__dirname + path.normalize(info.getPath(req)));
});


