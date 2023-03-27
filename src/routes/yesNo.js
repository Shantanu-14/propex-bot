const router = require("express").Router()
const { yesNoResponse } = require('../controllers/yesNoResponse')

router.post("/no", yesNoResponse);
router.post("/yes", yesNoResponse);

module.exports = router; 