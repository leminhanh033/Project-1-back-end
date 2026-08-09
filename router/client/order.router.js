const router=require('express').Router();
const orderValidate=require("../../validates/admin/order.validate.js");
const orderController=require("../../controllers/client/order.controller.js");

router.post('/infor',orderValidate.orderCreate, orderController.customerInfor)

router.get('/success',orderController.orderSuccessPage);

router.get('/payment/zalopay',orderController.zalopay);
router.post('/payment/success/zalopay',orderController.zalopaySuccessPost);

router.get('/payment/bank',orderController.bank);
router.get('/payment/success/bank',orderController.bankSuccessPost);

router.get('/payment/momo',orderController.momo);
router.post('/payment/success/momo',orderController.momoSuccessPost);


module.exports=router
