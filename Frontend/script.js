let captchaId = null;

let startTime = 0;

let attempts = 0;

let mouseEvents = 0;

let clickEvents = 0;

let keyEvents = 0;

let mouseSpeeds = [];

let lastMouseX = null;

let lastMouseY = null;

let lastMouseTime = null;

let challengeType = null;


/* ============================================================
   ELEMENTS
   ============================================================ */

const captchaText =
    document.getElementById("captchaText");

const captchaInput =
    document.getElementById("captchaInput");

const captchaForm =
    document.getElementById("captchaForm");

const refreshBtn =
    document.getElementById("refreshBtn");

const botSimulationBtn =
    document.getElementById("botSimulationBtn");

const result =
    document.getElementById("result");

const honeypot =
    document.getElementById("website");


/* ============================================================
   ANALYTICS
   ============================================================ */

const responseMetric =
    document.getElementById("responseMetric");

const mouseMetric =
    document.getElementById("mouseMetric");

const attemptMetric =
    document.getElementById("attemptMetric");

const honeypotMetric =
    document.getElementById("honeypotMetric");

const riskScore =
    document.getElementById("riskScore");

const classification =
    document.getElementById("classification");


/* ============================================================
   LOAD CAPTCHA
   ============================================================ */

async function loadCaptcha() {

    try {

        const response =
            await fetch("/api/captcha");

        if (!response.ok) {

            throw new Error(
                "CAPTCHA request failed"
            );

        }

        const data =
            await response.json();


        captchaId =
            data.id;

        challengeType =
            data.challengeType;


        /*
         * New backend sends an SVG image.
         */

        if (data.captchaImage) {

            captchaText.innerHTML = "";

            const image =
                document.createElement("img");

            image.src =
                data.captchaImage;

            image.alt =
                "CAPTCHA";

            image.style.width =
                "100%";

            image.style.height =
                "100%";

            image.style.maxWidth =
                "100%";

            image.style.objectFit =
                "contain";

            captchaText.appendChild(
                image
            );

        }

        /*
         * Backward compatibility.
         */

        else if (data.captcha) {

            captchaText.textContent =
                data.captcha;

        }


        captchaInput.value = "";

        honeypot.value = "";


        startTime =
            Date.now();


        attempts = 0;

        mouseEvents = 0;

        clickEvents = 0;

        keyEvents = 0;

        mouseSpeeds = [];

        lastMouseX = null;

        lastMouseY = null;

        lastMouseTime = null;


        resetAnalytics();


        result.className = "";

        result.textContent = "";


    }

    catch (error) {

        console.error(
            "CAPTCHA loading error:",
            error
        );

        result.className =
            "error";

        result.textContent =
            "Unable to load CAPTCHA.";

    }

}


/* ============================================================
   RESET ANALYTICS
   ============================================================ */

function resetAnalytics() {

    responseMetric.textContent =
        "—";

    mouseMetric.textContent =
        "—";

    attemptMetric.textContent =
        "—";

    honeypotMetric.textContent =
        "—";

    riskScore.textContent =
        "—";

    classification.textContent =
        "WAITING";


    classification.style.color =
        "#8bb4ff";

    classification.style.background =
        "rgba(79,140,255,0.08)";
}


/* ============================================================
   MOUSE TRACKING
   ============================================================ */

document.addEventListener(
    "mousemove",
    function (event) {

        mouseEvents++;

        const now =
            Date.now();


        if (
            lastMouseX !== null &&
            lastMouseY !== null &&
            lastMouseTime !== null
        ) {

            const dx =
                event.clientX -
                lastMouseX;

            const dy =
                event.clientY -
                lastMouseY;


            const distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );


            const elapsed =
                now -
                lastMouseTime;


            if (elapsed > 0) {

                const speed =
                    distance /
                    (elapsed / 1000);

                mouseSpeeds.push(
                    speed
                );

            }

        }


        lastMouseX =
            event.clientX;

        lastMouseY =
            event.clientY;

        lastMouseTime =
            now;

    }
);


/* ============================================================
   CLICK TRACKING
   ============================================================ */

document.addEventListener(
    "click",
    function () {

        clickEvents++;

    }
);


/* ============================================================
   KEYBOARD TRACKING
   ============================================================ */

document.addEventListener(
    "keydown",
    function () {

        keyEvents++;

    }
);


/* ============================================================
   AVERAGE MOUSE SPEED
   ============================================================ */

function getAverageMouseSpeed() {

    if (
        mouseSpeeds.length === 0
    ) {

        return 0;

    }


    const total =
        mouseSpeeds.reduce(
            function (
                sum,
                value
            ) {

                return sum + value;

            },
            0
        );


    return (
        total /
        mouseSpeeds.length
    );

}


/* ============================================================
   HIDDEN BEHAVIOURAL CHALLENGE
   ============================================================ */

async function completeChallenge() {

    let passed =
        false;


    /*
     * Mouse challenge
     */

    if (
        challengeType === "mouse" &&
        mouseEvents >= 3
    ) {

        passed = true;

    }


    /*
     * Keyboard challenge
     */

    if (
        challengeType === "keyboard" &&
        keyEvents >= 1
    ) {

        passed = true;

    }


    /*
     * Click challenge
     */

    if (
        challengeType === "click" &&
        clickEvents >= 1
    ) {

        passed = true;

    }


    if (!passed) {

        return false;

    }


    try {

        const response =
            await fetch(
                "/api/challenge",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            id:
                                captchaId,

                            challengeType:
                                challengeType
                        })
                }
            );


        const data =
            await response.json();


        return Boolean(
            data.success
        );

    }

    catch (error) {

        console.error(
            "Challenge error:",
            error
        );

        return false;

    }

}


/* ============================================================
   DISPLAY ANALYTICS
   ============================================================ */

function showAnalytics(
    responseTime,
    attemptsValue,
    mouseEventsValue,
    honeypotFilled,
    risk
) {

    responseMetric.textContent =
        (
            Number(responseTime) /
            1000
        ).toFixed(2) +
        " sec";


    mouseMetric.textContent =
        mouseEventsValue;


    attemptMetric.textContent =
        attemptsValue;


    honeypotMetric.textContent =
        honeypotFilled
            ? "⚠ FILLED"
            : "✓ EMPTY";


    riskScore.textContent =
        risk
            ? risk.score +
              " / 100"
            : "—";


    if (risk) {

        classification.textContent =
            risk.classification;


        if (
            risk.classification &&
            risk.classification.includes(
                "BOT"
            )
        ) {

            classification.style.color =
                "#fca5a5";

            classification.style.background =
                "rgba(239,68,68,0.08)";

        }

        else {

            classification.style.color =
                "#86efac";

            classification.style.background =
                "rgba(34,197,94,0.08)";

        }

    }

}


/* ============================================================
   NORMAL HUMAN VERIFICATION
   ============================================================ */

captchaForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        attempts++;


        /*
         * Try to complete behavioural challenge.
         */

        await completeChallenge();


        const responseTime =
            Date.now() -
            startTime;


        const data = {

            id:
                captchaId,

            answer:
                captchaInput.value,

            honeypot:
                honeypot.value,

            responseTime:
                responseTime,

            attempts:
                attempts,

            mouseEvents:
                mouseEvents,

            avgMouseSpeed:
                getAverageMouseSpeed(),

            clickCount:
                clickEvents,

            keyEvents:
                keyEvents

        };


        await sendVerification(
            data
        );

    }
);


/* ============================================================
   SEND NORMAL VERIFICATION
   ============================================================ */

async function sendVerification(
    data
) {

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
                        JSON.stringify(data)
                }
            );


        const dataResult =
            await response.json();


        /*
         * Update analytics.
         */

        showAnalytics(

            data.responseTime,

            data.attempts,

            data.mouseEvents,

            Boolean(
                data.honeypot
            ),

            dataResult.risk

        );


        /*
         * HUMAN
         */

        if (
            dataResult.success
        ) {

            result.className =
                "success";


            result.innerHTML = `

                <strong>
                    ✓ HUMAN VERIFIED
                </strong>

                <br>

                Access Granted

                <br>

                Risk Score:
                ${dataResult.risk
                    ? dataResult.risk.score
                    : 0}

            `;

        }


        /*
         * BOT / FAILED
         */

        else {

            result.className =
                "error";


            let message = `

                <strong>
                    ✕ ACCESS DENIED
                </strong>

                <br>

                ${dataResult.message ||
                "Verification failed."}

            `;


            if (
                dataResult.risk
            ) {

                message += `

                    <br>

                    Risk Score:
                    ${dataResult.risk.score}

                    <br>

                    Classification:
                    ${dataResult.risk.classification}

                `;

            }


            result.innerHTML =
                message;


            /*
             * New CAPTCHA after
             * failed verification.
             */

            setTimeout(
                loadCaptcha,
                2000
            );

        }

    }

    catch (error) {

        console.error(
            "Verification error:",
            error
        );


        result.className =
            "error";

        result.textContent =
            "Server error. Please try again.";

    }

}


/* ============================================================
   BOT SIMULATION
   ============================================================ */

botSimulationBtn.addEventListener(
    "click",
    async function () {

        if (!captchaId) {

            result.className =
                "error";

            result.textContent =
                "CAPTCHA is not ready.";

            return;

        }


        result.className =
            "error";


        result.innerHTML = `

            <strong>
                🤖 BOT SIMULATION RUNNING
            </strong>

            <br>

            Simulating automated behaviour...

        `;


        botSimulationBtn.disabled =
            true;


        try {

            const response =
                await fetch(
                    "/api/bot-simulation",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({
                                id:
                                    captchaId
                            })
                    }
                );


            const data =
                await response.json();


            console.log(
                "Bot simulation:",
                data
            );


            if (
                data.risk
            ) {

                showAnalytics(

                    data.responseTime,

                    data.attempts,

                    data.mouseEvents,

                    true,

                    data.risk

                );


                result.className =
                    "error";


                result.innerHTML = `

                    <strong>
                        ✕ BOT DETECTED
                    </strong>

                    <br><br>

                    Automated behaviour detected.

                    <br>

                    Risk Score:
                    ${data.risk.score}/100

                    <br>

                    Classification:
                    ${data.risk.classification}

                    ${
                        data.ml
                            ? `<br>
                               ML:
                               ${
                                   data.ml.prediction === 1
                                       ? "BOT"
                                       : "HUMAN"
                               }`
                            : ""
                    }

                `;

            }

            else {

                result.className =
                    "error";


                result.innerHTML = `

                    <strong>
                        ✕ BOT SIMULATION FAILED
                    </strong>

                    <br>

                    ${data.message ||
                    "Risk analysis failed."}

                `;

            }

        }

        catch (error) {

            console.error(
                "Bot simulation error:",
                error
            );


            result.className =
                "error";


            result.textContent =
                "Server error during bot simulation.";

        }

        finally {

            botSimulationBtn.disabled =
                false;

        }

    }
);


/* ============================================================
   REFRESH CAPTCHA
   ============================================================ */

refreshBtn.addEventListener(
    "click",
    function () {

        honeypot.value = "";

        loadCaptcha();

    }
);


/* ============================================================
   INITIAL LOAD
   ============================================================ */

loadCaptcha();