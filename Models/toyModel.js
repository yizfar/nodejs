const mongoose = require("mongoose");
const Joi = require("joi");


let toySchema = new mongoose.Schema({
  name:String,
  info:String,
  category:Number,
  price:Number,
  img:{
    type:String, default:"https://images.pexels.com/photos/422292/pexels-photo-422292.jpeg?cs=srgb&dl=pexels-sebastian-voortman-422292.jpg&fm=jpg"
  },
  date_created:{
    type:Date, default:Date.now()
  },
 
  user_id:String
})

exports.toyModel = mongoose.model("toys", toySchema);


exports.validatetoy = (_reqBody) => {
  let joiSchema = Joi.object({
    name:Joi.string().min(2).max(99).required(),
    info:Joi.string().min(2).max(99).required(),
    price:Joi.number().min(1).max(99999).required(),
    category:Joi.number().min(1).max(9999).required(),
    img:Joi.string().min(1).max(999).allow(null,'')
  })
  return joiSchema.validate(_reqBody)
}