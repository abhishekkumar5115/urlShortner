const express = require("express");
const URL = require("../models/url");
const { restrictTo } = require("../middleware/auth");
const shortid = require("shortid");
const { connectToMongoDB } = require("../connection/url");
const mongoDb = require("mongodb");

 const router = express.Router();

 router.get("/admin/urls" , restrictTo(["ADMIN"]),async(req,res)=>{
    const allurls = await URL.find({});
    return res.render("home",{
        urls: allurls,
    });
 });

 router.get("/", restrictTo(["NORMAL", "ADMIN"]),async(req,res)=>{
    const allurls = await URL.find({ createdBy: req.user._id});
    return res.render("home",{
        urls: allurls,
    });
 });
router.get("/signup", (req, res)=>{
    return res.render("signup");
});
router.get("/login", (req, res)=>{
    return res.render("login");
});

router.get("/home",(req,res)=>{
    return res.redirect("/");
});

router.delete("/:_id",async (req,res)=>{
   const {_id} = req.params;
   let deleteurl = await URL.findByIdAndDelete(_id);
  res.redirect("/");
});


 module.exports = router;