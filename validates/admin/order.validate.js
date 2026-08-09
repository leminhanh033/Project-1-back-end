const Joi = require('joi');

module.exports.orderCreate = async (req, res, next) => {
  const schema = Joi.object({
    fullname: Joi.string().required().messages({
      "string.empty": "Vui lòng nhập họ và tên",
    }),
    phone: Joi.string().required().messages({
      "string.empty": "Vui lòng nhập số điện thoại",
    }),
    paidMethod: Joi.string().required().messages({
      "string.empty": "Vui lòng chọn phương thức thanh toán",
    }),
    note:Joi.string().allow(""),
    listProduct:Object,    
  })

  try {
    const value = await schema.validateAsync(req.body);
  } catch (error) {
    res.json({
      code: "error",
      message: error.details[0].message,
    })
    return;
  }
  next()
}
