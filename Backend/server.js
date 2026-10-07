const express = require("express");

const cors = require("cors");

const path = require("path");


const {
    generateCaptcha,
    generateCaptchaSVG
} = require("./captcha");


const {
    verifyCaptcha
} = require("./verification");


const {
    checkRateLimit
} = require("./rateLimiter");


const {
    logSecurityEvent,
    readLogs
} = require("./logger");


const app =
    express();


const PORT =
    3000;


/* ============================================================
   MIDDLEWARE
   ============================================================ */

app.use(
    cors()
);


app.use(
    express.json()
);


app.use(
    express.static(
        path.join(
            process.cwd(),
            "frontend"
        )
    )
);


/* ============================================================
   CAPTCHA MEMORY STORAGE
   ============================================================ */

const captchaStore =
    new Map();


/* ============================================================
   RATE LIMITING
   ============================================================ */

app.use(
    (req, res, next) => {

        const ip =
            req.ip ||
            req.connection.remoteAddress ||
            "unknown";


        if (
            !checkRateLimit(ip)
        ) {

            logSecurityEvent({

                event:
                    "RATE_LIMIT",

                ip:
                    ip,

                status:
                    "BLOCKED"

            });


            return res
                .status(429)
                .json({

                    success:
                        false,

                    message:
                        "Too many requests. Please try again later."

                });

        }


        next();

    }
);


/* ============================================================
   GENERATE CAPTCHA
   ============================================================ */

app.get(
    "/api/captcha",
    (req, res) => {

        const id =
            Date.now().toString() +
            Math.random()
                .toString(36)
                .substring(2);


        const captcha =
            generateCaptcha();


        const svg =
            generateCaptchaSVG(
                captcha
            );


        /*
         * Random behavioural challenge.
         */

        const challengeTypes = [

            "mouse",

            "keyboard",

            "click"

        ];


        const challenge =
            challengeTypes[
                Math.floor(
                    Math.random() *
                    challengeTypes.length
                )
            ];


        captchaStore.set(
            id,
            {

                answer:
                    captcha,

                createdAt:
                    Date.now(),

                challenge:
                    challenge,

                challengePassed:
                    false

            }
        );


        /*
         * Convert SVG into
         * a browser-safe data URI.
         */

        const captchaImage =
            "data:image/svg+xml;base64," +
            Buffer
                .from(svg)
                .toString("base64");


        res.json({

            id:
                id,

            captchaImage:
                captchaImage,

            challengeType:
                challenge

        });

    }
);


/* ============================================================
   BEHAVIOURAL CHALLENGE
   ============================================================ */

/*
app.post(
    "/api/challenge",
    (req, res) => {

        const {

            id,

            challengeType

        } = req.body;


        const stored =
            captchaStore.get(id);


        if (!stored) {

            return res
                .status(400)
                .json({

                    success:
                        false,

                    message:
                        "Invalid CAPTCHA session"

                });

        }


        if (
            stored.challenge ===
            challengeType
        ) {

            stored.challengePassed =
                true;


            return res.json({

                success:
                    true

            });

        }


        res.json({

            success:
                false

        });

    }
);
*/


/* ============================================================
   NORMAL CAPTCHA VERIFICATION
   ============================================================ */

app.post(
    "/api/verify",
    async (req, res) => {

        const {

            id,

            answer,

            honeypot,

            responseTime,

            attempts,

            mouseEvents,

            avgMouseSpeed,

            clickCount,

            keyEvents

        } = req.body;


        const storedCaptcha =
            captchaStore.get(id);


        if (!storedCaptcha) {

            return res
                .status(400)
                .json({

                    success:
                        false,

                    message:
                        "CAPTCHA expired or invalid"

                });

        }


        /* ====================================================
           EXPIRATION
           ==================================================== */

        const age =
            Date.now() -
            storedCaptcha.createdAt;


        if (
            age > 120000
        ) {

            captchaStore.delete(
                id
            );


            return res
                .status(400)
                .json({

                    success:
                        false,

                    message:
                        "CAPTCHA expired"

                });

        }


        /* ====================================================
           VERIFY
           ==================================================== */

        const result =
            await verifyCaptcha(

                storedCaptcha.answer,

                answer || "",

                {

                    honeypotFilled:
                        Boolean(
                            honeypot
                        ),

                    responseTime:
                        Number(
                            responseTime
                        ) || 0,

                    attempts:
                        Number(
                            attempts
                        ) || 1,

                    mouseEvents:
                        Number(
                            mouseEvents
                        ) || 0,

                    avgMouseSpeed:
                        Number(
                            avgMouseSpeed
                        ) || 0,

                    clickCount:
                        Number(
                            clickCount
                        ) || 0,

                    keyEvents:
                        Number(
                            keyEvents
                        ) || 0,

                    challengePassed:
                        Boolean(
                            storedCaptcha
                                .challengePassed
                        )

                }

            );


        /* ====================================================
           SECURITY LOG
           ==================================================== */

        logSecurityEvent({

            event:
                "CAPTCHA_VERIFICATION",

            ip:
                req.ip,

            responseTime:
                Number(
                    responseTime
                ),

            attempts:
                Number(
                    attempts
                ),

            mouseEvents:
                Number(
                    mouseEvents
                ),

            avgMouseSpeed:
                Number(
                    avgMouseSpeed
                ),

            clickCount:
                Number(
                    clickCount
                ),

            keyEvents:
                Number(
                    keyEvents
                ),

            honeypot:
                Boolean(
                    honeypot
                ),

            challengePassed:
                Boolean(
                    storedCaptcha
                        .challengePassed
                ),

            riskScore:
                result.risk
                    ? result.risk.score
                    : null,

            classification:
                result.risk
                    ? result.risk.classification
                    : "INVALID",

            mlPrediction:
                result.ml
                    ? result.ml.prediction
                    : null,

            mlConfidence:
                result.ml
                    ? result.ml.confidence
                    : null,

            success:
                result.success

        });


        /*
         * Only remove a CAPTCHA after
         * successful human verification.
         */

        if (
            result.success
        ) {

            captchaStore.delete(
                id
            );

        }


        res.json(
            result
        );

    }
);


/* ============================================================
   BOT SIMULATION
   ============================================================ */

app.post(
    "/api/bot-simulation",
    async (req, res) => {

        try {

            const {
                id
            } = req.body;


            const storedCaptcha =
                captchaStore.get(id);


            if (!storedCaptcha) {

                return res
                    .status(400)
                    .json({

                        success:
                            false,

                        message:
                            "CAPTCHA expired or invalid"

                    });

            }


            /*
             * Simulated automated behaviour.
             */

            const botData = {

                honeypotFilled:
                    true,

                responseTime:
                    500,

                attempts:
                    3,

                mouseEvents:
                    0,

                avgMouseSpeed:
                    5000,

                clickCount:
                    0,

                keyEvents:
                    0,

                challengePassed:
                    false

            };


            /*
             * We deliberately provide the correct
             * CAPTCHA answer.
             *
             * This demonstrates that knowing the
             * CAPTCHA itself is not enough to pass
             * the complete security system.
             */

            const result =
                await verifyCaptcha(

                    storedCaptcha.answer,

                    storedCaptcha.answer,

                    botData

                );


            console.log(
                "BOT SIMULATION RESULT:",
                result
            );


            /*
             * IMPORTANT:
             *
             * Use "event", not "type".
             * The dashboard uses "event".
             */

            logSecurityEvent({

                event:
                    "BOT_SIMULATION",

                ip:
                    req.ip,

                responseTime:
                    500,

                attempts:
                    3,

                mouseEvents:
                    0,

                avgMouseSpeed:
                    5000,

                clickCount:
                    0,

                keyEvents:
                    0,

                honeypot:
                    true,

                challengePassed:
                    false,

                riskScore:
                    result.risk
                        ? result.risk.score
                        : null,

                classification:
                    result.risk
                        ? result.risk.classification
                        : "INVALID",

                mlPrediction:
                    result.ml
                        ? result.ml.prediction
                        : null,

                mlConfidence:
                    result.ml
                        ? result.ml.confidence
                        : null,

                success:
                    result.success

            });


            /*
             * Send result to frontend.
             */

            res.json({

                ...result,

                responseTime:
                    500,

                attempts:
                    3,

                mouseEvents:
                    0

            });

        }

        catch (error) {

            console.error(
                "BOT SIMULATION ERROR:",
                error
            );


            res
                .status(500)
                .json({

                    success:
                        false,

                    message:
                        "Bot simulation failed",

                    error:
                        error.message

                });

        }

    }
);


/* ============================================================
   DASHBOARD API
   ============================================================ */

app.get(
    "/api/dashboard",
    (req, res) => {

        try {

            const logs =
                readLogs();


            /*
             * Include both:
             *
             * CAPTCHA_VERIFICATION
             * BOT_SIMULATION
             */

            const securityLogs =
                logs.filter(
                    log =>

                        log.event ===
                            "CAPTCHA_VERIFICATION"

                        ||

                        log.event ===
                            "BOT_SIMULATION"
                );


            const total =
                securityLogs.length;


            /*
             * Successful normal verification
             * is considered human.
             */

            const humans =
                securityLogs.filter(
                    log =>

                        log.event ===
                            "CAPTCHA_VERIFICATION"

                        &&

                        log.success ===
                            true
                ).length;


            /*
             * Failed verification and bot
             * simulations are suspicious.
             */

            const suspicious =
                securityLogs.filter(
                    log =>

                        log.success ===
                            false

                        ||

                        log.event ===
                            "BOT_SIMULATION"
                ).length;


            /*
             * Average response time.
             */

            const responseTimes =
                securityLogs
                    .map(
                        log =>
                            Number(
                                log.responseTime
                            )
                    )
                    .filter(
                        value =>
                            Number.isFinite(
                                value
                            )
                    );


            const averageResponseTime =
                responseTimes.length === 0

                    ? 0

                    :

                    responseTimes.reduce(
                        (
                            sum,
                            value
                        ) =>

                            sum + value,

                        0
                    ) /
                    responseTimes.length;


            res.json({

                total:
                    total,

                humans:
                    humans,

                suspicious:
                    suspicious,

                averageResponseTime:
                    averageResponseTime,

                recentLogs:
                    securityLogs
                        .slice(-15)
                        .reverse()

            });

        }

        catch (error) {

            console.error(
                "Dashboard API error:",
                error
            );


            res
                .status(500)
                .json({

                    success:
                        false,

                    message:
                        "Unable to load dashboard"

                });

        }

    }
);


/* ============================================================
   DASHBOARD PAGE
   ============================================================ */

app.get(
    "/dashboard",
    (req, res) => {

       res.sendFile(
    path.join(
        process.cwd(),
        "frontend",
        "dashboard.html"
    )
);

    }
);


/* ============================================================
   FRONTEND FALLBACK
   ============================================================ */

app.get(
    "*",
    (req, res) => {

        res.sendFile(
    path.join(
        process.cwd(),
        "frontend",
        "index.html"
    )
);

    }
);


/* ============================================================
   START SERVER
   ============================================================ */

if (require.main === module) {

    app.listen(
        PORT,
        () => {

            console.log(
                `Server running on http://localhost:${PORT}`
            );

        }
    );

}

module.exports = app;
