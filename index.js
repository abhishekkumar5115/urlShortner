const express = require("express");
const path =  require("path");
const cookieparser = require("cookie-parser");
const {connectToMongoDB} = require("./connection/url");
const { checkforAuthentication, restrictTo} = require("./middleware/auth");
const URL = require("./models/url");
const methodoverride = require("method-override");
const urlRoute = require("./router/url");
const staticRouter = require("./router/staticrouter");
const userRoute = require("./router/user");

const app = express();
const port = 8001;

connectToMongoDB("mongodb://127.0.0.1/short-url")
.then(() =>{console.log("Mongodb connected")});

app.set("view engine","ejs");
app.set("views", path.resolve("./views"));
app.use(methodoverride("_method"));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieparser());
app.use(checkforAuthentication);

app.use("/url", restrictTo(["NORMAL","ADMIN"]), urlRoute);
app.use("/user",userRoute);
app.use("/",staticRouter);

app.get("/url/:shortId", async(req,res) => {
 const shortId = req.params.shortId;
 const entry = await URL.findOneAndUpdate(
    {
        shortId,
    },
    {
      $push:{
        visitHistory: {
            timestamp: Date.now(),
        },
      },
    }
    
  );
  if(entry){
    res.redirect(entry.redirectURL); 
  }
  else{
    return res.redirect("/");
  }
});

app.listen(port,()=>console.log(`server started ${port}`));