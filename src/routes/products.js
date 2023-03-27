const router = require("express").Router();
const productsController = require('../controllers/products');

router.post("/productDetails", productsController?.products);
router.post("/eInvoicing", productsController?.eInvoicingController);

module.exports = router;
