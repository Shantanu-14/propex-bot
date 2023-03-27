const router = require("express").Router();

const freshStartController = require("../controllers/freshStart");

router.post("/restart", freshStartController?.restart);

module.exports = router;