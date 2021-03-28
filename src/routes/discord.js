const router = require("express").Router();
const { getBotGuilds } = require("../utils/api");
const User = require("../database/models/user");
const { getMutualGuilds } = require("../utils/utils");
const Guild = require("../database/models/guild");

router.get("/guilds", async (req, res) => {
  const guilds = await getBotGuilds();
  const user = await User.findOne({ id: req.user.id });
  if (user) {
    const userGuilds = user.get("guilds");
    const mutualGuilds = getMutualGuilds(userGuilds, guilds);
    console.log(user.guilds);
    res.send(mutualGuilds);
  } else {
    return res.status(401).send({ msg: "Unauthorized" });
  }
});

router.put("/guilds/:guildId/prefix", async (req, res) => {
  const { prefix } = req.body;
  const { guildId } = req.params;
  if (!prefix) return res.status(400).send({ msg: "Prefix Required" });
  const update = await Guild.findOneAndUpdate(
    { guild: guildId },
    { settings: { prefix } },
    { new: true }
  );
  console.log(update)
  return update
    ? res.send(update)
    : res.status(400).send({ msg: "Could not find document" });
});

router.get("/guilds/:guildId/config", async (req, res) => {
  const { guildId } = req.params;
  const config = await Guild.findOne({ guild: guildId });
  console.log(guildId)
  return config ? res.send(config) : res.status(404).send({ msg: "Not found" });
});

module.exports = router;
