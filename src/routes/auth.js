const router = require("express").Router();
const passport = require("passport");
const CLIENT_PORT = process.env.CLIENT_PORT;
router.get("/discord", passport.authenticate("discord"));
console.log(CLIENT_PORT);
router.get(
  "/discord/redirect",
  passport.authenticate("discord", {
    failureRedirect: "/",
  }),
  (req, res) =>
    res.redirect(
      CLIENT_PORT
        ? `http://localhost:${CLIENT_PORT}/menu`
        : "https://poutingemoji.github.io/pfp-logger-client/#/menu"
    )
);

router.get("/", (req, res) => {
  if (req.user) {
    res.send(req.user);
  } else {
    res.status(401).send({ msg: "Unauthorized" });
  }
});

module.exports = router;
