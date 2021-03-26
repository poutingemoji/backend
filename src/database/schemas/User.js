const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true, 
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  guilds: {
    type: Array,
    required: true,
  }
})

module.exports = mongoose.model("User", UserSchema)