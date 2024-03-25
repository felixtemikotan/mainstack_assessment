import Joi from "joi";


export const createUserValidator = Joi.object().keys({
  fullName: Joi.string().trim().required(),
  username: Joi.string().trim().required(),
  password: Joi.string().required().min(4),
  confirmPassword: Joi.any().equal(Joi.ref('password')).required().label('Confirm password').messages({ 'any.only': '{{#label}} does not match' }),
}).with('password', 'confirmPassword');

export const loginValidator = Joi.object().keys({
  username: Joi.string().trim().required(),
  password: Joi.string().trim().required(),
})

export const addProductValidator = Joi.object().keys({
  name: Joi.string().trim().required(),
  price: Joi.number().required(),
  description: Joi.string().trim().required(),
  category: Joi.string().trim().required(),
  totalItems: Joi.number().required(),

})
export const updateProductValidator = Joi.object().keys({
  name: Joi.string().trim().optional(),
  price: Joi.number().optional(),
  description: Joi.string().trim().optional(),
  category: Joi.string().trim().optional(),
  totalItems: Joi.number().optional(),

})
export const options = {
    abortEarly:
      false,
    errors: {
      wrap: { label: "" },
    },
  };

