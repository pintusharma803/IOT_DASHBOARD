const form = document.getElementById("loginForm");
let mobile = "";

form.addEventListener("submit", function (e) {

    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    mobile = document.getElementById("mobile").value.trim();

    const error = document.getElementById("errorlogin");

    error.innerHTML = "";

    if (name === "") {

        error.innerHTML = "Please enter your name.";

        return;

    }

    if (!/^[6-9][0-9]{9}$/.test(mobile)) {

        error.innerHTML = "Please enter a valid mobile number.";

        return;

    }

    sendOtp();
});


// OTP VERIFICATION

const otpInputs = document.querySelectorAll(".otp");

otpInputs.forEach((input, index) => {

    input.addEventListener("input", function () {

        this.value = this.value.replace(/[^0-9]/g, '');

        if (this.value && index < otpInputs.length - 1) {

            otpInputs[index + 1].focus();

        }

    });

    input.addEventListener("keydown", function (e) {

        if (e.key === "Backspace" && this.value === "" && index > 0) {

            otpInputs[index - 1].focus();

        }

    });

});

document.querySelector(".otp-box").addEventListener("paste", function (e) {

    e.preventDefault();

    const data = e.clipboardData.getData("text").trim();

    if (/^\d{5}$/.test(data)) {

        data.split("").forEach((digit, index) => {

            otpInputs[index].value = digit;

        });

        otpInputs[4].focus();

    }

});

document.getElementById("verifyBtn").addEventListener("click", verifyOTP);

async function verifyOTP() {

    const error = document.getElementById("errorotp");

    error.innerHTML = "";

    const otp = [...otpInputs].map(input => input.value).join("");

    if (otp.length !== 5) {

        error.innerHTML = "Please enter 5 digits OTP.";

        return;

    }

    try {

        const response = await fetch("/api/auth/verify-otp", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                otp: otp,
                mobile:mobile
            })

        });

        const result = await response.json();

        if (response.ok && result.success) {

            window.location.href = result.redirect;

        } else {

            error.innerHTML = result.message || "Invalid OTP.";

        }

    } catch (err) {

        console.error(err);

        error.innerHTML = "Server Error.";

    }

}

// LOGIN TO OTP PAGE

async function sendOtp() {

    const name = document.getElementById("name").value.trim();
    mobile = document.getElementById("mobile").value.trim();

    const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name,
            mobile
        })
    });

    const result = await response.json();

    if (response.ok && result.success) {

        document.getElementById("loginPage").style.display = "none";

        document.getElementById("otpPage").style.display = "block";

    }

}