const router = require("express").Router();
const passport = require("passport");
const CLIENT_PORT = process.env.CLIENT_PORT
router.get("/discord", passport.authenticate("discord"));
router.get(
  "/discord/redirect",
  passport.authenticate("discord"),
  (req, res) => {
    res.redirect(
      `${
        CLIENT_PORT
          ? `http://localhost:${CLIENT_PORT}`
          : "https://poutingemoji.github.io/pfp-logger-client"
      }/menu`
    );
  }
);

router.get("/", (req, res) => {
  if (req.user) {
    res.send(req.user);
  } else {
    res.status(401).send({ msg: "Unauthorized" });
  }
});

module.exports = router;
