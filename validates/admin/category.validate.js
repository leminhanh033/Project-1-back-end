const Joi = require('joi');

module.exports.createValidate = async(req,res,next) => {
  const schema = Joi.object({
    name: Joi.string().required().messages({
      "string.empty":"Vui lòng nhập tên thư mục",
    }),
    position: Joi.string().allow(''),
    parent: Joi.string().allow(''),
    state: Joi.string().allow(''),
    description: Joi.string().allow(''),
  })
 
  try {
    const value = await schema.validateAsync(req.body);
  } catch (error) {
    res.json({
      code:"error",
      message:error.details[0].message,
    })
    return;
  }
  next()
}
