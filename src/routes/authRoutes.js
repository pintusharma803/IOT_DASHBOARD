const router = require("express").Router();
const User = require("../models/User");
const auth = require("../controllers/authController");
const middleware = require("../middleware/authMiddleware");


router.post("/send-otp",auth.sendOtp);
router.post("/verify-otp",auth.verifyOtp);

router.post("/logout",(req,res)=>{
    res.clearCookie("token");
    res.json({
        message:"Logged Out"
    });
});

router.get("/profile",middleware.authMiddleware,async (req,res)=>{
    const user = await User.findById(req.user.id);
    res.render("profile");
});

module.exports = router;