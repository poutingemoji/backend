const CryptoJS = require("crypto-js")

function getMutualGuilds(userGuilds, botGuilds) {
  /* return userGuilds.filter(
    (guild) =>
      botGuilds.find((botGuild) => botGuild.discordId === guild.discordId) &&
      (guild.permissions & 0x20) === 0x20
  );*/
  const validGuilds = userGuilds.filter(
    (guild) => (guild.permissions & 0x20) === 0x20
  );
  const included = [];
  const excluded = validGuilds.filter((guild) => {
    const findGuild = botGuilds.find((g) => g.discordId === guild.discordId);
    if (!findGuild) return guild;
    included.push(findGuild);
  });
  return { excluded, included };
}

function encrypt(token) {
  return CryptoJS.AES.encrypt(token, process.env.SECRET_PASSPHRASE)
}

function decrypt(token) {
  return CryptoJS.AES.decrypt(token, process.env.SECRET_PASSPHRASE);
}
module.exports = { getMutualGuilds, encrypt, decrypt };
