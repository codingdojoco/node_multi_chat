var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

var myApp = {
	conversations: {},
}

app.set('users')

// all environments
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());

app.use(express.cookieParser());
app.use(express.session({ secret: '1234567890QWERTY' }));
app.use(app.router);

app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/room', function(req, res){
  // console.log(myApp.conversations);

  if(typeof myApp.conversations[req.sessionID] === 'undefined')
  {
    res.redirect('/');
  }
  else
  {
    res.render('room', { conversations: myApp.conversations, session_id: req.sessionID });
  }
});

app.post('/login', function(req, res){
  req.session.name = req.param('name');
  myApp.conversations[req.sessionID] = {};
  // console.log(myApp.conversations);
  res.redirect('/room');
});

app.post('/update_info', function(req, res){

  myApp.conversations[req.sessionID] = {  name: req.session.name,
                                          message: req.param('message'),
                                          x: req.param('x'),
                                          y: req.param('y'),
                                          direction: req.param('direction'),
                                          step: req.param('step')};

  //broadcast the updated conversations to the clients
  io.sockets.emit('update_messages', myApp.conversations);
  res.send('updated');
});

//listening to connection event
io.sockets.on('connection', function (socket){
  //broadcast the updated conversations to the clients
  socket.emit('update_messages', myApp.conversations);
});

server.listen(process.env.PORT || 8080);