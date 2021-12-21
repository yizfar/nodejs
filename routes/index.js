const express = require("express");
const router = express.Router();

router.get("/", (req,res) => {
  res.json({msg:"Work from index.js from 0 express"})
})

module.exports = router;