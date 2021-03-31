const router = require("express").Router();
const passport = require("passport");
const { CLIENT_ROOT_URL } = require("../config");

router.get("/discord", passport.authenticate("discord"));

router.get(
  "/discord/redirect",
  passport.authenticate("discord", {
    failureRedirect: CLIENT_ROOT_URL,
  }),
  (req, res) => {
    return res.redirect(`${CLIENT_ROOT_URL}/#/dashboard`);
  }
);

router.get("/", (req, res) => {
  if (req.user) {
    res.send(req.user);
  } else {
    res.status(401).send({ msg: "Unauthorized" });
  }
});

router.get("/logout", function (req, res) {
  req.logout();
  return res.redirect(`${CLIENT_ROOT_URL}/menu`);
});

module.exports = router;
