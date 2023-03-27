const router = require("express").Router();
const serviceController = require("../controllers/services");

router.post("/serviceDetails", serviceController?.services);
router.post("/upgradingDynamics", serviceController?.upgradeDynamics);
router.post("/implementingDynamics", serviceController?.implementDynamics);
router.post("/onshoreOffshore", serviceController?.onShoreOffShore);
router.post("/auditDynamics", serviceController?.auditDynamics);
router.post("/consultingServices", serviceController?.consultingServices);

module.exports = router;
