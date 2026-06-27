require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./src/app");
const http = require('http');
const server = http.createServer(app);

// socket initialize
const socket = require("./socket");
socket.init(server);
const mqttClient = require("./src/mqtt/mqtt");
mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("database connected");
    server.listen(process.env.PORT,()=>{
        console.log("server is running")
    });
});
