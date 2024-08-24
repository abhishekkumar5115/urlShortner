const {getUser} = require("../service/auth");

function checkforAuthentication(req, res, next) {
    const tokenCookie = req.cookies?.token;
    if(!tokenCookie ) return next();

    const token = tokenCookie;
    const user = getUser(token);

    req.user = user;
    return next();
}

function restrictTo(roles) {
    return function(req, res, next) {
        if(!req.user ) return res.redirect("/login");

        // if(!roles.include(req.user.role)) return res.end("Unauthorise");

        next();
    };
}

// async function restrictToLoggedinUserOnly(req,res,next){
//     const userUid = req.cookies?.uid;

//     if(!userUid) return res.redirect("/login");
//     const user= getUser(userUid)

//     if(!user) return res.redirect("/login");

//     req.user = user;
//     next();
// }

// async function checkAuth(req,res,next){
//     const userUid = req.cookies?.uid;

//     const user= getUser(userUid)

//     if(!user) return res.redirect("/login");

//     req.user = user;
//     next();
// }

module.exports = {
       checkforAuthentication,
       restrictTo,
};