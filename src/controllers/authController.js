const User = require("../models/User");
const Otp = require("../models/otp");
const generateOtp = require("../utils/generateOtp");
const generateToken = require("../utils/generateToken");
const twilio = require('../utils/twilioOtp');


exports.sendOtp = async (req, res) => {
    const OTP_EXPIRY_TIME = 5 * 60 * 1000;
    try {
        const { mobile } = req.body;
        if (!mobile) {
            return res.status(400).json({
                success: false,
                message: "Mobile number is required"
            });
        }
        const otp = generateOtp();

        await Otp.deleteMany({ mobile });
        await Otp.create({
            mobile,
            otp,
            expiresAt: new Date(Date.now() + OTP_EXPIRY_TIME)
        });

        try {
            twilio.messages.create({
                body: `${otp} is your verification code for Piezo Device`,
                from: process.env.FROM,
                to: `+91${mobile}`
            });
            console.log("OTP sent successfully");
            console.log(`${otp} is your verification code for Piezo Device`);
            return res.status(200).json({
                success: true,
                message: "OTP sent successfully"
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                success: false,
                message: "failed to send OTP"
            })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};



exports.verifyOtp = async (req, res) => {
    try {
        const { mobile, otp } = req.body;
        const otpDoc = await Otp.findOne({ mobile });

        // OTP database me hai ya nhi hai
        if (!otpDoc) {
            return res.status(400).json({
                success: false,
                message: "OTP not found"
            });
        }

        // otp expire check 
        if (otpDoc.expiresAt < new Date()) {
            return res.status(400).json({
                success: false,
                message: "OTP Expired"
            });
        }


        if (otpDoc.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        let user = await User.findOne({ mobile });
        if (!user) {
            user = await User.create({ mobile });
        }

        const token = generateToken(user._id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict"
        });

        await Otp.deleteMany({ mobile });
        res.status(200).json({
            success: true,
            message: "Login Successful",
            redirect: "/api/auth/profile"
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: error

        })

    }
};