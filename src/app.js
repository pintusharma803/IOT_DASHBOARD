const express = require("express");
const path = require("path");
const User = require("../src/models/User");
const middleware = require("../src/middleware/authMiddleware");
const cookieParser = require("cookie-parser");


const app = express();
app.use(express.json());
app.use(cookieParser());
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "../src/public")));

app.get("/",(req,res)=>{
    res.render("home");
});

app.get("/login",middleware.guestMiddleware,async (req,res)=>{
    res.render("login");
})

app.use("/api/auth",require("./routes/authRoutes"));
app.use("/",require("../src/routes/mqttRoutes"));



module.exports = app;