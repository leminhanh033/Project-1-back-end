const router=require('express').Router();
const accountController=require("../../controllers/admin/account.controller.js");
const accountValidate=require("../../validates/admin/account.validate.js");

router.get('/login',accountController.login);
router.post('/login',accountValidate.login,accountController.loginPost);

router.get('/register',accountController.register);
router.post('/register',accountValidate.register,accountController.registerPost);


router.get('/forgot-password',accountController.forgotpassword);

router.get('/enter-otp',accountController.enterOTP);

router.get('/reset-password',accountController.resetpassword);

module.exports=router;