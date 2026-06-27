const jwt = require("jsonwebtoken");

// FOR PROFILE MIDDLEWARE

const authMiddleware = (req,res,next) =>{
    const token = req.cookies.token;
    
    if(!token){
        return res.redirect("/login");
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch{
        res.clearCookie("token");
        return res.redirect("/login");
    }
};

// FOR LOGIN MIDDLEWARE

const guestMiddleware = (req,res,next)=>{
    const token = req.cookies.token;

    if(!token){
        return next();
    }

    try {
        jwt.verify(token,process.env.JWT_SECRET);
        return res.redirect("/api/auth/profile");
    } catch (error) {
        console.log(error);
        res.clearCookie("token");
        next();
    }
};

module.exports = {authMiddleware,guestMiddleware};