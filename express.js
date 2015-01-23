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
    root = req.body.root;
	matched = req.body.yes;
	unmatched = req.body.no;

	var time = getDateTime();

	// {template:/photos/43.png, matched:[....], unmatched:[....]}
	jsonStr = "{\"template\": " + root + ", \"matched\": [" + matched + "], \"unmatched\": [" + unmatched + "]}\n";
	fs.appendFile('triplets/triplets_' + time + '.json', jsonStr); 

	for (var m in matched) {
		for (var u in unmatched) {
			str = root + ", " + matched[m] + ", " + unmatched[u] + "\n";
			fs.appendFile('triplets/triplets_' + time + '.csv', str);
		}
	}
});

app.get('/', function (req, res) {
    console.log(__dirname);
    res.sendFile(__dirname + path.normalize('/index.html'));
});

app.get('/newImage', function (req, res) {
    randImages = info.getRandImages();
    res.send(randImages);
});

app.get('/*', function (req, res) {
    console.log(info.getPath(req));
    res.sendFile(__dirname + path.normalize(info.getPath(req)));
});


