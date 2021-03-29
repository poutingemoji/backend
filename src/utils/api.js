const fetch = require("node-fetch");
const OAuth2Credentials = require("../database/models/OAuth2Credientials");
const TOKEN = process.env.DASHBOARD_BOT_TOKEN;
const { decrypt } = require("../utils/utils");
const DISCORD_API = "http://discord.com/api/v6";
const CryptoJS = require("crypto-js");

async function getBotGuilds() {
  const response = await fetch(`${DISCORD_API}/users/@me/guilds`, {
    method: "GET",
    headers: {
      Authorization: `Bot ${TOKEN}`,
    },
  });
  return response.json();
}

async function getGuildRoles(guildId) {
  const response = await fetch(`${DISCORD_API}/guilds/${guildId}/roles`, {
    method: "GET",
    headers: {
      Authorization: `Bot ${TOKEN}`,
    },
  });
  return response.json();
}

async function getUserGuilds(discordId) {
  const credentials = await OAuth2Credentials.findOne({ discordId });
  if (!credentials) throw new Error("No credentials.");
  const encryptedAccessToken = credentials.get("accessToken");
  const decrypted = decrypt(encryptedAccessToken);
  const accessToken = decrypted.toString(CryptoJS.enc.Utf8);
  const response = await fetch(`${DISCORD_API}/users/@me/guilds`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.json();
}

module.exports = { getBotGuilds, getGuildRoles, getUserGuilds };
