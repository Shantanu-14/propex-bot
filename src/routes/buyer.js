const router = require("express").Router();
const buyerController = require("../controllers/buyer")
const viewProperty = require("../controllers/viewProperty");
const iConnect = require("../controllers/iconnect");
const interestedInPropertyController = require("../controllers/interestedInProperty");

router.post("/buyer", buyerController?.buyer);
router.post("/viewProperty", viewProperty?.buyer);
router.post("/iconnect", iConnect?.buyer);
router.post("/interestedInProperty", interestedInPropertyController?.buyer);


module.exports = router;