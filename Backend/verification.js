const {
    calculateRisk
} = require("./riskAnalyzer");


function verifyCaptcha(
    captcha,
    userAnswer,
    data
) {

    /*
        Check CAPTCHA answer
    */

    const captchaCorrect =
        captcha.toUpperCase() ===
        userAnswer.toUpperCase();


    if (!captchaCorrect) {

        return {

            success: false,

            message:
                "Incorrect CAPTCHA",

            risk: null

        };

    }


    /*
        Analyze behaviour
    */

    const risk =
        calculateRisk(data);


    /*
        High risk
    */

    if (risk.score >= 50) {

        return {

            success: false,

            message:
                "Suspicious activity detected",

            risk

        };

    }


    /*
        Verification successful
    */

    return {

        success: true,

        message:
            "Verification successful",

        risk

    };

}


module.exports = {
    verifyCaptcha
};