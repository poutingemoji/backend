const router = require("express").Router();
const auth = require("./auth")
router.get("/", (req, res) => res.send(200))
module.exports = router;