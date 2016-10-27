'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module){
    app.io = require('socket.io')(app.start());
    app.polling = require('./start-polling.js');
    app.polling.setup();
    app.io.on('connection', function(socket){
      console.log('a user connected');
      //socket.on('node-up', function(msg,node){
      //  console.log('message: ' + msg);
      //  app.io.emit('chat message', msg);
      //});
      //socket.on('node-down', function(msg,node){
      //  console.log('message: ' + msg);
      //  app.io.emit('chat message', msg);
      //});
      socket.on('disconnect', function(){
        console.log('user disconnected');
      });
    });
    //begin monitoring
   // app.start();
  }
});
