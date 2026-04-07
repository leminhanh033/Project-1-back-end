const router=require('express').Router();
const accountController=require("../../controllers/admin/account.controller.js");

router.get('/login',accountController.login);
router.get('/register',accountController.register);
router.get('/forgot-password',accountController.forgotpassword);
router.get('/enter-otp',accountController.enterOTP);
router.get('/reset-password',accountController.resetpassword);

module.exports=router;