const mongoose = require("mongoose");
const generate = require("../helpers/generate.js")

const userSchema = new mongoose.Schema({
    fullName: String, 
    email : String,
    password: String,
    tokenUser: {
      type: String,
      default: generate.generateRandomString(20)
    },
    phone: String, 
    avatar: String,
    status: {
      type :String,
      default: "active"
    },
    requestFriends: Array, //List request add friend
    acceptFriends: Array, //List accept add friend
    friendList : [
      {
        user_id: String, 
        room_chat_id : String
      }
    ],
    statusOnline : String,
    delete: {
        type:Boolean,
        default:false
    },
    deletedAt: Date
},
{
 timestamps: true
});
const User = mongoose.model('User', userSchema, "users");

module.exports = User;