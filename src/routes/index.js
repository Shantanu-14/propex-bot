const router = require("express").Router();
const reachUsRoutes = require('./contactUs');
const defaultRoutes = require('./default');
const detectNameRoutes = require('./detectName');
const generalRoutes = require('./general');
const logsRoutes = require('./logs');
const productRoutes = require('./products');
const serviceRoutes = require('./services');
const yesNoRoutes = require('./yesNo')
const careersRoutes = require('./careers');
const numberRoutes = require('./number');
const buyerRoutes = require('./buyer');
const freshStartRoutes = require('./freshStart');
const initRoutes = require('./init');


// const { routes } = require("../../server");

router.use('/reachUs', reachUsRoutes);
router.use('/default', defaultRoutes);
router.use('/detectName', detectNameRoutes);
router.use('/general', generalRoutes);
router.use('/logs', logsRoutes);
router.use('/products', productRoutes);
router.use('/yesNo',yesNoRoutes);
router.use('/careers',careersRoutes);
router.use('/services', serviceRoutes);
router.use('/number', numberRoutes);
router.use('/user', buyerRoutes)
router.use('/freshStart', freshStartRoutes)
router.use('/init', initRoutes)


module.exports = router;
