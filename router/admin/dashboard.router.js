const router=require('express').Router();
const dashboardController=require("../../controllers/admin/dashboard.controller.js");

router.get("/", dashboardController.overview);

module.exports= router;