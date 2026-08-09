module.exports.uploadController=async(req,res)=>{
  res.json({
    "location":req.file?req.file.path:"",
  })
}