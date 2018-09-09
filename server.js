var PORT = process.env.PORT || 80;

var express = require('express');
var app = express();
var path = require('path');

app.use(express.static(path.join(__dirname, 'src')));

app.get('/', function (req, res) {
    res.render('src/index');
});

app.listen(PORT, function () {
    console.log('Server running at http://127.0.0.1:' + PORT + '/');
});
