const router = require("express").Router();
const { getBotGuilds, getGuildRoles } = require("../utils/api");
const User = require("../database/models/User");
const { getMutualGuilds } = require("../utils/utils");
const Guild = require("../database/models/Guild");

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
  console.log(update);
  return update
    ? res.send(update)
    : res.status(400).send({ msg: "Could not find document" });
});

router.get("/guilds/:guildId/config", async (req, res) => {
  const { guildId } = req.params;
  const config = await Guild.findOne({ guild: guildId });
  console.log(guildId);
  return config ? res.send(config) : res.status(404).send({ msg: "Not found" });
});

router.get("/guilds/:guildId/roles", async (req, res) => {
  const { guildId } = req.params;
  try {
    const roles = await getGuildRoles(guildId);
    res.send(roles);
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: "Internal Server Error" });
  }
});

router.put("/guilds/:guildId/roles/default", async (req, res) => {
  const { defaultRole } = req.body;
  if (!defaultRole) return res.status(400).send({ msg: "Bad Request" });
  const { guildId } = req.params;
  try {
    const update = await Guild.findOneAndUpdate(
      { guild: guildId },
      { defaultRole },
      { new: true }
    );
    return update
      ? res.send(update)
      : res.status(400).send({ msg: "Bad Request" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: "Internal Server Error" });
  }
});
module.exports = router;
