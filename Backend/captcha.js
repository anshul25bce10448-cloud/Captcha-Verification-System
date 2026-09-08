const characters =
    "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";// (I 0 O 1) are removed so that the user doesnt get confused while entering the captcha


function generateCaptcha(length = 5) {

    let captcha = "";

    for (
        let i = 0;
        i < length;
        i++
    ) {

        const randomIndex =
            Math.floor(
                Math.random() *
                characters.length
            );

        captcha +=
            characters[randomIndex];

    }

    return captcha;
}


module.exports = {
    generateCaptcha
};