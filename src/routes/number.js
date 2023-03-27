const router = require("express").Router();
const numberController = require('../controllers/number');

router.post('/controller', numberController?.number);

module.exports = router;