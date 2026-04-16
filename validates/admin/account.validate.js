const Joi = require('joi');

module.exports.register=async(req,res,next)=>{
  const schema = Joi.object({
    fullname: Joi.string().required()
    .messages({
      "string.empty":"Vui lòng nhập họ tên",
    }),
    password: Joi.string().required().min(3)
    .messages({
      "string.empty":"Vui lòng nhập mật khẩu",
      "string.min":"Mật khẩu cần ít nhất 3 ký tự",
    })
    .custom((value, helpers) => {
      if (!/[a-z]/.test(value)) {
        return helpers.message("Mật khẩu cần ít nhất 1 ký tự thường");
      }
      if (!/[A-Z]/.test(value)) {
        return helpers.message("Mật khẩu cần ít nhất 1 ký tự in hoa");
      }
      if (!/[0-9]/.test(value)) {
        return helpers.message("Mật khẩu cần ít nhất 1 chữ số");
      }
      return value;
    }, 'custom validation'),
    email: Joi.string().required().email()
    .messages({
      "string.empty":"Vui lòng nhập email",
      "string.email":"Email không hợp lệ",
    }),
    status:Joi.string(),
  })
  try{
  const value = await schema.validateAsync(req.body);
  }
  catch(error){
    if(error){
      const errorMessage=error.details[0].message;
      res.json({
        code:"error",
        message:errorMessage,
      })
      return;
    }
  }
  next();
}

module.exports.login=async(req,res,next)=>{
  const schema = Joi.object({
    email:Joi.string().required().email()
    .messages({
      "string.empty":"Vui lòng nhập email của bạn",
      "string.email":"Email không hợp lệ"
    }),
    password:Joi.string().required()
    .messages({
      "string.empty":"Vui lòng nhập mật khẩu của bạn"
    }),
  })
  try {
    const value = await schema.validateAsync(req.body);
  } catch (error) {
    if(error){
      res.json({
        code:"error",
        message:error.details[0].message,
      })
    }
  }
  next();
}
