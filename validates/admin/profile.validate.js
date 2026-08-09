const Joi = require('joi');

module.exports.accountEdit=async(req,res,next)=>{
  const schema = Joi.object({
    fullname: Joi.string()
      .required()
      .messages({
        "string.empty": "Vui lòng nhập họ tên",
        "any.required": "Vui lòng nhập họ tên",
      }),

    phone: Joi.string()
      .pattern(/^(0|\+84)(3|5|7|8|9)[0-9]{8}$/)
      .messages({
        "string.pattern.base": "Số điện thoại không hợp lệ",
      }),

    email: Joi.string()
      .required()
      .email()
      .messages({
        "string.empty": "Vui lòng nhập email",
        "any.required": "Vui lòng nhập email",
        "string.email": "Email không hợp lệ",
      }),

    role: Joi.string()
      .allow(""),

    roleName: Joi.string()
      .allow(""),      
    
  });

  try {
    const value = await schema.validateAsync(req.body);
  } catch (error) {
    if(error){
      res.json({
        code:"error",
        message:error.details[0].message,
      })
      return;
    }
  }
  next();
}

module.exports.settingAccountEdit=async(req,res,next)=>{
  const schema = Joi.object({
    fullname: Joi.string()
      .required()
      .messages({
        "string.empty": "Vui lòng nhập họ tên",
        "any.required": "Vui lòng nhập họ tên",
      }),

    phone: Joi.string()
      .pattern(/^(0|\+84)(3|5|7|8|9)[0-9]{8}$/)
      .messages({
        "string.pattern.base": "Số điện thoại không hợp lệ",
      }),

    email: Joi.string()
      .required()
      .email()
      .messages({
        "string.empty": "Vui lòng nhập email",
        "any.required": "Vui lòng nhập email",
        "string.email": "Email không hợp lệ",
      }),

    role: Joi.string()
      .allow(""),

    roleName: Joi.string()
      .allow(""),
      
    status: Joi.string()
      .allow(""),

    password: Joi.string().allow(""),
  });

  try {
    const value = await schema.validateAsync(req.body);
  } catch (error) {
    if(error){
      res.json({
        code:"error",
        message:error.details[0].message,
      })
      return;
    }
  }
  next();
}

module.exports.changePassword=async(req,res,next)=>{
  const schema = Joi.object({
    password: Joi.string()
      .required()
      .messages({
        "string.empty": "Vui lòng nhập mật khẩu",
        "any.required": "Vui lòng nhập mật khẩu",
      }),
  });

  try {
    const value = await schema.validateAsync(req.body);
  } catch (error) {
    if(error){
      res.json({
        code:"error",
        message:error.details[0].message,
      })
      return;
    }
  }
  next();
}