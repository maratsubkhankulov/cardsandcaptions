const express = require('express');
const app = express();
const request = require('request');
const path = require('path');

app.use(express.static("public"));

app.get('/test', function (req, res) {
	res.sendFile(path.join(__dirname + '/public/test.html'));
});

const PORT = 3000
app.listen(PORT, function () {
	console.log("Listening on port: " + PORT);
});
