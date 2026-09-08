function calculateRisk(data) {

    let score = 0;

    const reasons = [];


    /*
        Honeypot detection
    */

    if (data.honeypotFilled) {

        score += 50;

        reasons.push(
            "Hidden field was filled"
        );

    }


    /*
        Response time
    */

    if (data.responseTime < 1000) {

        score += 25;

        reasons.push(
            "Extremely fast response"
        );

    }

    else if (
        data.responseTime < 2000
    ) {

        score += 10;

        reasons.push(
            "Very fast response"
        );

    }


    /*
        Multiple attempts
    */

    if (data.attempts >= 3) {

        score += 15;

        reasons.push(
            "Multiple attempts"
        );

    }


    /*
        Mouse interaction
    */

    if (data.mouseEvents === 0) {

        score += 10;

        reasons.push(
            "No mouse interaction"
        );

    }


    /*
        Classification
    */

    let classification;


    if (score >= 50) {

        classification =
            "BOT / SUSPICIOUS";

    }

    else {

        classification =
            "HUMAN / LOW RISK";

    }


    return {

        score,

        classification,

        reasons

    };

}


module.exports = {
    calculateRisk
};