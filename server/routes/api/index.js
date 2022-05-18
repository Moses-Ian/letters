const router = require("express").Router();

router.use("/user", require("./user-routes"));

module.exports = router;
