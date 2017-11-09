var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// mongoose.connect('mongodb://localhost:27017/loginapp');
// var db = mongoose.connection;

var userSchema = mongoose.Schema({
    username : {
        type : String,
        index : true
    },
    password : {
        type : String
    },
    email : {
        type : String
    },
    password : {
        type : String
    }
});

var User = module.exports = mongoose.model('User', userSchema);
module.exports.createUser = (newUser,callback) => {
    bcrypt.genSalt(10,(eror,salt) => {
        bcrypt.hash(newUser.password,salt, (error,hash) => {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};

module.exports.getUserByUsername = (username,callback) => {

    var query = {username: username};
    User.findOne(query,callback);
};
module.exports.getUserById = (id,callback) => {
        User.findById(id,callback);
};
module.exports.comparePassword = (candidatePassword,hash,callback) => {
    bcrypt.compare(candidatePassword,hash,(error,isMatch) => {
        if(error) throw error;
        callback(null,isMatch);
    });
};