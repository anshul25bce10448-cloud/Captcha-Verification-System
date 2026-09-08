let captchaId = null;

let startTime = 0;

let attempts = 0;

let mouseEvents = 0;

const captchaText =
    document.getElementById("captchaText");

const captchaInput =
    document.getElementById("captchaInput");

const captchaForm =
    document.getElementById("captchaForm");

const refreshBtn =
    document.getElementById("refreshBtn");

const result =
    document.getElementById("result");

const honeypot =
    document.getElementById("website");


/*
    Load a new CAPTCHA
*/

async function loadCaptcha() {

    try {

        const response =
            await fetch("/api/captcha");

        if (!response.ok) {
            throw new Error("Failed to load CAPTCHA");
        }

        const data =
            await response.json();

        captchaId = data.id;

        captchaText.textContent =
            data.captcha;

        captchaInput.value = "";

        startTime = Date.now();

        attempts = 0;

        mouseEvents = 0;

        result.className = "";

        result.textContent = "";

    }

    catch (error) {

        result.className = "error";

        result.textContent =
            "Unable to load CAPTCHA.";

    }
}


/*
    Count mouse movement events
*/

document.addEventListener(
    "mousemove",
    function () {

        mouseEvents++;

    }
);


/*
    CAPTCHA form submission
*/

captchaForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        attempts++;

        const responseTime =
            Date.now() - startTime;

        const requestData = {

            id: captchaId,

            answer:
                captchaInput.value,

            honeypot:
                honeypot.value,

            responseTime:
                responseTime,

            attempts:
                attempts,

            mouseEvents:
                mouseEvents
        };


        try {

            const response =
                await fetch(
                    "/api/verify",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                requestData
                            )
                    }
                );


            const data =
                await response.json();


            if (data.success) {

                result.className =
                    "success";

                result.innerHTML = `
                    <strong>✓ Verification Successful</strong>
                    <br>
                    Access Granted
                    <br>
                    Risk Score:
                    ${data.risk.score}
                `;

            }

            else {

                result.className =
                    "error";

                let message = `
                    <strong>✕ Verification Failed</strong>
                    <br>
                    ${data.message}
                `;


                if (data.risk) {

                    message += `
                        <br>
                        Risk Score:
                        ${data.risk.score}

                        <br>

                        Classification:
                        ${data.risk.classification}
                    `;

                }


                result.innerHTML =
                    message;


                setTimeout(
                    loadCaptcha,
                    1500
                );

            }

        }

        catch (error) {

            result.className =
                "error";

            result.textContent =
                "Server error. Please try again.";

        }

    }
);


/*
    Refresh CAPTCHA
*/

refreshBtn.addEventListener(
    "click",
    function () {

        loadCaptcha();

    }
);


/*
    Initial CAPTCHA
*/

loadCaptcha();