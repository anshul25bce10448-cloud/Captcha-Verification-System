const express = require("express");

const cors = require("cors");

const path = require("path");


const {
    generateCaptcha
} = require("./captcha");


const {
    verifyCaptcha
} = require("./verification");


const app =
    express();


const PORT = 3000;


/*
    Middleware
*/

app.use(cors());

app.use(express.json());


/*
    Serve frontend
*/

app.use(
    express.static(
        path.join(
            __dirname,
            "../frontend"
        )
    )
);


/*
    Temporary CAPTCHA storage

    In a production application,
    use a database or secure session.
*/

const captchaStore =
    new Map();


/*
    Generate CAPTCHA
*/

app.get(
    "/api/captcha",
    (req, res) => {

        const id =
            Date.now().toString()
            +
            Math.random()
                .toString(36)
                .substring(2);


        const captcha =
            generateCaptcha();


        captchaStore.set(
            id,
            {

                answer: captcha,

                createdAt:
                    Date.now()

            }
        );


        res.json({

            id,

            captcha

        });

    }
);


/*
    Verify CAPTCHA
*/

app.post(
    "/api/verify",
    (req, res) => {

        const {

            id,

            answer,

            honeypot,

            responseTime,

            attempts,

            mouseEvents

        } = req.body;


        /*
            Check CAPTCHA exists
        */

        const storedCaptcha =
            captchaStore.get(id);


        if (!storedCaptcha) {

            return res.status(400).json({

                success: false,

                message:
                    "CAPTCHA expired or invalid"

            });

        }


        /*
            CAPTCHA expires after 2 minutes
        */

        const age =
            Date.now() -
            storedCaptcha.createdAt;


        if (age > 120000) {

            captchaStore.delete(id);


            return res.status(400).json({

                success: false,

                message:
                    "CAPTCHA expired"

            });

        }


        /*
            Verify
        */

        const result =
            verifyCaptcha(

                storedCaptcha.answer,

                answer || "",

                {

                    honeypotFilled:
                        Boolean(honeypot),

                    responseTime:
                        Number(responseTime) || 0,

                    attempts:
                        Number(attempts) || 1,

                    mouseEvents:
                        Number(mouseEvents) || 0

                }

            );


        /*
            Delete CAPTCHA after
            successful verification
        */

        if (result.success) {

            captchaStore.delete(id);

        }


        res.json(result);

    }
);


/*
    Frontend fallback
*/

app.get(
    "*",
    (req, res) => {

        res.sendFile(
            path.join(
                __dirname,
                "../frontend/index.html"
            )
        );

    }
);


/*
    Start server
*/

app.listen(
    PORT,
    () => {

        console.log(
            `CAPTCHA server running at http://localhost:${PORT}`
        );

    }
);