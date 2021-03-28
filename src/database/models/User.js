const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  discordId: {
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
  },
  /*
  
  */
});

module.exports = model("User", UserSchema);
