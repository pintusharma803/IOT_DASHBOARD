const { Server } = require('socket.io');
const state = require("./src/mqtt/state");

 let io ;

// let dashboardData = {
//     status:"OFFLINE",
//     temperature:25,
//     led:"OFF"
// };

function init(server){
    io = new Server(server);
    io.on("connection", (socket) => {
    console.log("Dashboard Connected");
    socket.emit("init-data", {
        status: state.deviceStatus,
        temperature: state.temp,
        led: state.ledinfo
    });
});
};

function getIO(){
    return io;
}

module.exports = {init,getIO};

