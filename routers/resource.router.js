const router = require('express').Router();

const resourceController = require('../controllers/resource.controller');

router.get('/img/:fac', resourceController.img.byFac);
router.get('/vid/corporate', resourceController.video.corporate);

module.exports = router;