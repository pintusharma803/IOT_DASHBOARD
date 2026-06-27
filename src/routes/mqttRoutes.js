const router = require('express').Router()
const mqttClient = require("../mqtt/mqtt");

router.post("/publish", (req, res) => {
    const topic = req.body.topic;
    const message = req.body.message;
    mqttClient.publish(topic, message, { retain: true });

    console.log(
        `Published -> Topic: ${topic}, Message: ${message}`
    );
    res.json({
        success: true,
        topic,
        message
    });
});

module.exports = router;