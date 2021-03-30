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
  (req, res) => res.redirect("/menu")
);

router.get("/", (req, res) => {
  if (req.user) {
    res.send(req.user);
  } else {
    res.status(401).send({ msg: "Unauthorized" });
  }
});

module.exports = router;
