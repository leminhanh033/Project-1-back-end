const Joi = require('joi');

module.exports.createValidate = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required().messages({
      "string.empty": "Vui lòng nhập tên tour",
    }),
    category: Joi.string().allow(''),
    position: Joi.string().allow(''),
    state: Joi.string().allow(''),

    description: Joi.string().allow(''),
    position: Number,

    oldAdult: Joi.number().allow( ''),
    oldChild: Joi.number().allow(''),
    oldBaby: Joi.number().allow(''),

    newAdult: Joi.number().allow(''),
    newChild: Joi.number().allow(''),
    newBaby: Joi.number().allow(''),

    remainAdult: Joi.number().allow(''),
    remainChild: Joi.number().allow(''),
    remainBaby: Joi.number().allow(''),

    destination: Joi.string().allow(''),

    time: Joi.string().allow(''),
    vehicle: Joi.string().allow(''),
    departureDate: Joi.string().allow(''),

    information: Joi.string().allow(''),

    schedule: Joi.string().allow('')
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
