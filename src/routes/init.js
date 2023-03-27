const router = require("express").Router();
const initController = require("../controllers/init");


router.post("/initialize", initController?.init);


module.exports = router;