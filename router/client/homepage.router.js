const router=require('express').Router();
//controller
const HomepageController=require("../../controllers/client/Homepage.controller.js");

router.get('/', HomepageController.Homepage);

router.post('/email-for-information',HomepageController.emailForInfor)

module.exports = router;