const router=require('express').Router();
const {uploadController}=require("../../controllers/admin/upload.controller.js");
const {checkPermission}=require("../../middlewares/admin/checkPermission.middleware.js")

const multer  = require('multer')
const {storage}=require("../../helpers/cloudinary.helper.js");
const parser = multer({ storage: storage });

router.post("/",parser.single("file"),uploadController)

module.exports=router;
