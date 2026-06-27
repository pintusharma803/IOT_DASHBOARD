let onoffstatus;
let state = false;
const socket = io();
socket.on("init-data", (data) => {

    document.getElementById('temperature').innerText = `${data.temperature} °C`;

    if (data.status === "OFFLINE") {
        setOffline();
    } else {
        setOnline();
    }

    if (data.led === "ON") {
        state = true;
        document.getElementById('powerText').className = "on-text";
        document.getElementById('switchIcon').className = "fa-solid fa-power-off power-btn poweron";
        document.getElementById('powerText').innerText = data.led;

    } else {
        state = false;
        document.getElementById('powerText').className = "off-text";
        document.getElementById('switchIcon').className = "fa-solid fa-power-off power-btn poweroff";
        document.getElementById('powerText').innerText = data.led;

    }
});

socket.on("temperature", (temp) => {
    document.getElementById('temperature').innerText = `${temp} °C`;

});
// if multiple browser me open ho to esko remove comment kare
socket.on("data", (ledinfo) => {
    if (ledinfo == "ON") {
        document.getElementById('powerText').className = "on-text";
        document.getElementById('switchIcon').className = "fa-solid fa-power-off power-btn poweron";
        document.getElementById('powerText').innerText = ledinfo;
    } else {
        document.getElementById('powerText').className = "off-text";
        document.getElementById('switchIcon').className = "fa-solid fa-power-off power-btn poweroff";
        document.getElementById('powerText').innerText = ledinfo;
    }

});

socket.on("status", (status) => {
    if (status === "OFFLINE") {
        setOffline();
    } else {
        setOnline();
    }
});


// Device Online
function setOnline() {

    document.getElementById("statusDot")
        .className = "dot online";

    document.getElementById("deviceStatus")
        .innerText = "Online";

    document.getElementById("deviceStatus")
        .className = "online-text";
}

// Device Offline

function setOffline() {

    document.getElementById("statusDot")
        .className = "dot offline";

    document.getElementById("deviceStatus")
        .innerText = "Offline";

    document.getElementById("deviceStatus")
        .className = "offline-text";
}





async function toggleLed() {

    state = !state;
    onoffstatus = state ? "ON" : "OFF";

    if (state) {
        document.getElementById('powerText').className = "on-text";
        document.getElementById('switchIcon').className = "fa-solid fa-power-off power-btn poweron";
        document.getElementById('powerText').innerText = onoffstatus;

    } else {
        document.getElementById('powerText').className = "off-text";
        document.getElementById('switchIcon').className = "fa-solid fa-power-off power-btn poweroff";
        document.getElementById('powerText').innerText = onoffstatus;
    }

    await fetch("/publish", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            topic: "pintu/home/led",
            message: onoffstatus
        })
    })


}