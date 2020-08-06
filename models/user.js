//This page is for login and registerd purpose
const mongoose = require('mongoose')

//Create the user schema
const UserSchema = new mongoose.Schema({
    username: {
        type: String
    },
    password: {
        type: String
    }
});
//Create, instantiate and export model with schema
const Users = mongoose.model("User", UserSchema);
module.exports = Users;