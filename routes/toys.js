const express = require("express");
const { auth } = require("../middlewares/auth");
const { toyModel,validatetoy } = require("../Models/toyModel");
const router = express.Router();

router.get("/", (req,res) => {
  res.json({msg:"Work toys"})
})

//add toy to db

router.post("/",auth,     async(req,res) => {
    let validBody = validatetoy(req.body);
    if(validBody.error){
      return res.status(400).json(validBody.error.details);
    }
    try{
      let toy = new toyModel(req.body);
      toy.user_id = req.userToken._id
      await toy.save();
      res.status(201).json(toy);
    }
    catch(err){
      console.log(err)
      res.status(500).json(err)
    }
  })

  // delete toy
router.delete("/:idDel",auth, async(req,res) => {
  let idDel = req.params.idDel;
  try{
    let data = await toyModel.deleteOne({_id:idDel,user_id:req.userToken._id});
    // deletedCount -> 1 הצליח למחוק
    res.json(data);
  }
  catch(err){
    console.log(err)
    res.status(500).json(err)
  }
})
  // edit/update toy
router.put("/:idEdit",auth, async(req,res) => {
  let validBody = validatetoy(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  
  try{
    let idEdit = req.params.idEdit;
    let data = await toyModel.updateOne({_id:idEdit,user_id:req.userToken._id},req.body);
    // editdCount -> 1 
    res.json(data);
  }
  catch(err){
    console.log(err)
    res.status(500).json(err)
  }
})

  //toy list by user
  router.get("/mytoys" , auth, async(req,res) => {
    let perPage = req.query.perPage || 10;
    let page = (req.query.page) ? req.query.page - 1: 0;
    let sort = req.query.sort || "_id"; 
    let reverse = req.query.reverse == "yes" ? -1 : 1; 
    try{
      let data = await toyModel.find({user_id:req.userToken._id})
      .limit(Number(perPage))
      .skip(page * perPage)
      .sort({[sort]:reverse})
      res.json(data);
    }
    catch(err){
      console.log(err);
      res.status(500).json(err);
    }
  })

  
//?s=  search in mytoys
router.get("/mytoys/search",auth , async(req,res) => {
  let perPage = req.query.perPage || 2
 let page = (req.query.page >=1) ? req.query.page -1: 0;
  try{
    let search = req.query.s;
    let expSearch = new RegExp(search, "i");
    let data = await toyModel.find({user_id:req.userToken._id,$or:[{name:expSearch},{info:expSearch}]}).limit(Number(perPage))
    .skip(page * perPage);
    res.json(data)
  }
  catch(err){
    console.log(err);
    res.status(500).json(err);
  }
})

  //by category
router.get("/cat/:catname",auth, async(req,res) => {
  let catname = req.params.catname;
  let perPage = req.query.perPage || 2
  let page = (req.query.page >=1) ? req.query.page -1: 0;
  try{
    let data = await toyModel.find({user_id:req.userToken._id,category:catname}).limit(Number(perPage))
    .skip(page * perPage);;
    res.json(data);
  }
  catch(err){
    console.log(err)
    res.status(500).json(err)
  }
})
//by price
router.get("/price", async(req,res) => {
  let reverse = req.query.reverse == "yes" ? -1 : 1; 
  let max = req.query.max || 1000000 ;
  let min = req.query.min || 0;
  // let data = await ProductModel.find({price:{$lte:max}});
  let data = await toyModel.find({$and:[{price:{$lte:max}},{price:{$gte:min}}]});
  res.json(data);
})

module.exports = router;