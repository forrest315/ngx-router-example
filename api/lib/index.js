var api = require('./controllers/api_controller.js');
var db = require('./controllers/db_controller.js');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.send('hello world');
});

app.get('/api/conf', api.conf);
app.get('/api/list', api.list);
app.get('/api/add', api.addOne);
app.post('/api/add', api.add);
app.get('/api/del', api.del);
app.get('/api/load', api.loadOne);
app.post('/api/load', api.load);

app.use('/db/get', db.get);
app.use('/db/set', db.set);
app.use('/db/del', db.del);
app.use('/db/keys', db.keys);
app.use('/db/dump', db.dump);

// 定制404页面
app.use(function(req, res) {
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not Found');
});

//定制500页面
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.type('text/plain');
    res.status(500);
    res.send('500 - Server Error');
});

app.listen(app.get('port'), function() {
    console.log('server running on port ' + app.get('port') + '.');
});