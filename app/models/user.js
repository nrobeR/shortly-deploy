// var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: {type:String,unique: true,required:true},
  password: {type:String,required:true},
  created_at: {type:Date,default: Date.now},
  salt: String
});

UserSchema.methods.comparePassword = function(attemptedPassword,callback){
  bcrypt.compare(attemptedPassword,this.password,function(err,isMatch){
    callback(isMatch);
  });
};

UserSchema.methods.hashPassword = function(){
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.password,null,null).bind(this)
    .then(function(hash){
      this.password = hash;
    });
};

UserSchema.pre('save',function(next){
  var user = this;
  if(!user.isModified('password')){
    return next();
  }

  this.hashPassword().then(next());
});

module.exports = mongoose.model('User',UserSchema);

// var User = db.Model.extend({
//   tableName: 'users',
//   hasTimestamps: true,
//   initialize: function(){
//     this.on('creating', this.hashPassword);
//   },
//   comparePassword: function(attemptedPassword, callback) {
//     bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
//       callback(isMatch);
//     });
//   },
//   hashPassword: function(){
//     var cipher = Promise.promisify(bcrypt.hash);
//     return cipher(this.get('password'), null, null).bind(this)
//       .then(function(hash) {
//         this.set('password', hash);
//       });
//   }
// });

// module.exports = User;
