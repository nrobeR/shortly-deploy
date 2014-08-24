var app = require('./server-config.js');
var mongoose = require('mongoose');

var port = process.env.PORT || 4568;

mongoose.connect('mongodb://127.0.0.1:' + port + '/test');

mongoose.connection.once('connected',function(){
  console.log('mongodb connected');
});

app.listen(port);

console.log('Server now listening on port ' + port);
