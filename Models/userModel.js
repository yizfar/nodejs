const mongoose = require("mongoose");
const {config}= require("../config/secret");
const Joi = require("joi");
const jwt = require("jsonwebtoken");


let userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  address: String,
  // role->  אם רגיל או אדמין
  role: {
    type: String, default: "regular"
  },
  date_created: {
    type: Date, default: Date.now()
  }
})

exports.UserModel = mongoose.model("users", userSchema);
// מייצר טוקן
exports.genToken = (_id) => {
 
  let token = jwt.sign({_id:_id}, config.TokenSecret, {expiresIn:"360mins"});
  return token;
}


exports.validateUser = (_reqBody) => {
  let joiSchema = Joi.object({
    name: Joi.string().min(2).max(99).required(),
    // .email() -> בודק שזה אימייל תקני
    email: Joi.string().min(2).max(99).email().required(),
    password: Joi.string().min(3).max(99).required(),
    phone:  Joi.string().min(9).max(99).allow(null,""),
    address: Joi.string().min(9).max(99).allow(null,""),
  })
  return joiSchema.validate(_reqBody)
}


// וולדיזציה ללוג אין של משתמש
exports.validateLogin = (_reqBody) => {
  let joiSchema = Joi.object({
    email: Joi.string().min(2).max(99).email().required(),
    password: Joi.string().min(3).max(99).required(),
  })
  return joiSchema.validate(_reqBody)
}

