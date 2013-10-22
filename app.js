
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var RedisStore = require('connect-redis')(express);

var app = express(),
    store  = new express.session.MemoryStore;

var myApp = {
	conversations: [],
	session_id: 0
}

app.set('users')

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());

app.use(express.cookieParser());
app.use(express.session({
  store: store,
  secret: '1234567890QWERTY'
}))
app.use(app.router);

app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/room', function(req, res){
  console.log(myApp.conversations);
  res.render('room', { title: 'Room', conversations: myApp.conversations, my_name: req.session.name });
});

app.post('/login', function(req, res){
  myApp.conversations[req.sessionID] = {name: req.param('name')};
  req.session.name = req.param('name');
  console.log(myApp.conversations);
  res.redirect('/room');
});

app.post('/new_message', function(req, res){
  myApp.conversations[req.sessionID].message = req.param('message');
  res.send('updated');
});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
