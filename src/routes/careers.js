const router = require("express").Router();
const careersController = require('../controllers/careers.js');

router.post("/uploadResume", careersController?.careers);

module.exports = router;
