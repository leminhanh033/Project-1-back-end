const router=require('express').Router();
const accountController=require("../../controllers/admin/account.controller.js");
const accountValidate=require("../../validates/admin/account.validate.js");
const {checkLogin}=require('../../middlewares/admin/checkLogin.middleware');

router.get('/login',accountController.login);
router.post('/login',accountValidate.login,accountController.loginPost);

router.post('/logout',accountController.logoutPost);


router.get('/register',accountController.register);
router.post('/register',accountValidate.register,accountController.registerPost);


router.get('/forgot-password',accountController.forgotpassword);
router.post('/forgot-password',accountValidate.forgotpassword,accountController.forgotpasswordPOST);

router.get('/enter-otp',accountController.enterOTP);
router.post('/enter-otp',accountValidate.enterotp,accountController.enterOTPPOST);

router.get('/reset-password',accountController.resetpassword);
router.post('/reset-password',checkLogin,accountValidate.resetpassword,accountController.resetpasswordPost);

module.exports=router;