const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    mobile:String,
    otp:String,
    expiresAt:{
        type :Date,
        required :true
    }
});

otpSchema.index({expiresAt : 1},
    {expireAfterSeconds:10}
);

module.exports = mongoose.model("Otp",otpSchema);