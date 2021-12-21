const express = require("express");
const bcrypt = require("bcrypt");
const { UserModel, validateUser, validateLogin,genToken } = require("../Models/userModel");
const {auth} = require("../middlewares/auth");
const router = express.Router();

router.get("/", (req,res) => {
  res.json({msg:"Users work"})
})



router.get("/authUser",auth,(req,res) => {
  res.json({status:"ok",user_id:req.userToken._id});
})

//sign up
router.post("/",async(req,res) => {
  let validBody =  validateUser(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details)
  }
  try{
let user = new UserModel(req.body)
user.password = await bcrypt.hash(user.password,10)
await user.save();
user.password = "*******"
res.status(201).json(user);
  }
  catch(err){
    if(err.code == 11000){
      return res.status(400).json({msg:"email already excists in system"})
    }
    console.log(err);
    red.status(400).json(err)
  }
  res.json(data);
})

//sign in
router.post("/login", async (req, res) => {
  let validBody = validateLogin(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ msg: "Email not found 11" });
    }
    let validPass = await bcrypt.compare(req.body.password, user.password)
    if (!validPass) {
      return res.status(401).json({ msg: "Password or email is worng ! 22" });
    }
 
    let newToken = genToken(user._id);
    res.json({ token: newToken });
  }
  catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})



module.exports = router;