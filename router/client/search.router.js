const router=require('express').Router();
//controller
const searchController=require("../../controllers/client/search.controller.js");


router.get('/',searchController.searchResult);

module.exports = router;