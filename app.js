const express = require('express');
const app = express();
const request = require('request');
const path = require('path');

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname + '/src/index.html'));
});

app.get('/api', function (req, res) {
	res.send('Hello World!');
});

app.get('/', function (req, res) {
});

const PORT = 3000
app.listen(PORT, function () {
	console.log("Listening on port: " + PORT)
});
