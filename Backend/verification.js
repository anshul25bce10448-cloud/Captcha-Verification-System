const {
    calculateRisk
} = require(
    "./riskAnalyzer"
);


const {
    predictWithML
} = require(
    "./mlBridge"
);


async function verifyCaptcha(
    captcha,
    userAnswer,
    data
) {


    // ========================================================
    // CAPTCHA CHECK
    // ========================================================

    const captchaCorrect =
        captcha.toUpperCase() ===
        userAnswer.toUpperCase();


    if (!captchaCorrect) {

        return {

            success: false,

            message:
                "Incorrect CAPTCHA",

            risk: null,

            ml: null

        };
    }


    // ========================================================
    // RULE-BASED RISK
    // ========================================================

    const risk =
        calculateRisk(data);


    // ========================================================
    // MACHINE LEARNING
    // ========================================================

    let mlResult = null;


    try {

        mlResult =
            await predictWithML({

                response_time:
                    data.responseTime,

                attempts:
                    data.attempts,

                honeypot:
                    data.honeypotFilled
                        ? 1
                        : 0,

                mouse_events:
                    data.mouseEvents

            });


    } catch (error) {

        console.error(
            "ML Error:",
            error.message
        );

    }


    // ========================================================
    // FINAL DECISION
    // ========================================================

    const mlBot =
        mlResult &&
        mlResult.prediction === 1;


    const suspicious =
        risk.score >= 50 ||
        mlBot;


    if (suspicious) {

        return {

            success: false,

            message:
                "Suspicious activity detected",

            risk,

            ml: mlResult

        };
    }


    return {

        success: true,

        message:
            "Verification successful",

        risk,

        ml: mlResult

    };
}


module.exports = {
    verifyCaptcha
};