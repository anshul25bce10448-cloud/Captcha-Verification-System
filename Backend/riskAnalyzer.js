function calculateRisk(data) {

    let score = 0;

    const reasons = [];


    // ========================================================
    // HONEYPOT
    // ========================================================

    if (data.honeypotFilled) {

        score += 50;

        reasons.push(
            "Hidden honeypot was filled"
        );
    }


    // ========================================================
    // RESPONSE TIME
    // ========================================================

    if (
        data.responseTime < 1000
    ) {

        score += 25;

        reasons.push(
            "Extremely fast response"
        );

    } else if (
        data.responseTime < 2000
    ) {

        score += 10;

        reasons.push(
            "Very fast response"
        );
    }


    // ========================================================
    // ATTEMPTS
    // ========================================================

    if (
        data.attempts >= 3
    ) {

        score += 15;

        reasons.push(
            "Multiple attempts"
        );
    }


    // ========================================================
    // MOUSE
    // ========================================================

    if (
        data.mouseEvents === 0
    ) {

        score += 10;

        reasons.push(
            "No mouse interaction"
        );
    }


    // ========================================================
    // MOUSE SPEED
    // ========================================================

    if (
        data.avgMouseSpeed > 2500
    ) {

        score += 10;

        reasons.push(
            "Unusually fast mouse movement"
        );
    }


    // ========================================================
    // CLICKS
    // ========================================================

    if (
        data.clickCount === 0
    ) {

        score += 5;

        reasons.push(
            "No click interaction"
        );
    }


    // ========================================================
    // KEYBOARD
    // ========================================================

    if (
        data.keyEvents === 0
    ) {

        score += 5;

        reasons.push(
            "No keyboard interaction"
        );
    }


    // ========================================================
    // HIDDEN CHALLENGE
    // ========================================================

    if (
        !data.challengePassed
    ) {

        score += 30;

        reasons.push(
            "Behavioral challenge failed"
        );
    }


    // ========================================================
    // LIMIT SCORE
    // ========================================================

    if (score > 100) {

        score = 100;
    }


    // ========================================================
    // CLASSIFICATION
    // ========================================================

    const classification =
        score >= 50
            ? "BOT / SUSPICIOUS"
            : "HUMAN / LOW RISK";


    return {

        score,

        classification,

        reasons

    };
}


module.exports = {
    calculateRisk
};