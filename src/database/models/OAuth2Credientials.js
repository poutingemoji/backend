const { Schema } = require("mongoose");
const { model } = require("mongoose");

const GuildSchema = new Schema({
  guild: {
    type: String,
    unique: true,
    required: true,
  },
  commands: {
    type: Map,
    of: Number,
  },
  blacklist: {
    type: Array,
    of: String,
  },
  settings: {
    prefix: String,
    default: {},
  },
  defaultRole: String,
  memberLogChannel: String,
});
module.exports = model("Setting", GuildSchema);
