const Joi = require('joi');

module.exports.roleCreate=async(req,res,next)=>{
  const schema = Joi.object({
   name:Joi.string().required()
    .messages({
      "string.empty":"Vui lòng nhập tên nhóm quyền",
    })
  }).unknown(true);
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

module.exports.settingAccountCreate=async(req,res,next)=>{
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

    password: Joi.string()
      .required()
      .min(3)
      .pattern(/[a-z]/)
      .pattern(/[A-Z]/)
      .pattern(/[0-9]/)
      .pattern(/[^\w\s]/)
      .messages({
        "string.empty": "Vui lòng nhập password của bạn",
        "any.required": "Vui lòng nhập password của bạn",
        "string.min": "Mật khẩu cần có ít nhất 3 kí tự",
        "string.pattern.base": "Mật khẩu không hợp lệ",
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