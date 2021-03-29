const { Schema, model } = require("mongoose");

const OAuth2CredentialsSchema = new Schema({
  accesstoken: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  discordId: {
    type: String,
    required: true,
  },
});
module.exports = model("OAuth2Credentials", OAuth2CredentialsSchema);
