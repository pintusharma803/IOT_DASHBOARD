const socket = require("../../socket");
const state = require("./state");
// const io = socket.getIO();
const mqtt = require("mqtt");

// let deviceStatus = "OFFLINE";
// let temp = 25;
// let lastseen = 0;
// let ledinfo = "OFF";



const options = {
    host: process.env.HOST,
    port: process.env.MQTT_PORT,
    protocol: 'mqtt'
    // username:'username'
    // password: 'your password'
}

const mqttClient = mqtt.connect(options);

mqttClient.on("connect", () => {
    console.log("MQTT Connected");
    mqttClient.subscribe("pintu/home/status");
    mqttClient.subscribe("pintu/home/temperature");
    mqttClient.subscribe("pintu/home/led");
});

mqttClient.on('message', (topic, message) => {
    const msg = message.toString();
    if (topic === "pintu/home/led") {
        state.ledinfo = msg;
        socket.getIO().emit("data", state.ledinfo); // if multiple mobile connect to use
    }
    if (topic === "pintu/home/status") {
        state.lastseen = Date.now();
    }
    if (topic === "pintu/home/temperature") {
        state.temp = msg;
        socket.getIO().emit("temperature", state.temp);
    }

});

mqttClient.on('error', (error) => {
    console.log(error);
});

setInterval(() => {
    const diff = Date.now() - state.lastseen;
    const newStatus = diff > 3000 ? "OFFLINE" : "ONLINE";
    if (newStatus !== state.deviceStatus) {
        state.deviceStatus = newStatus;
        socket.getIO().emit("status", state.deviceStatus);
    }
}, 500);

module.exports = mqttClient;