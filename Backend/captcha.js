const characters =
    "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";


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


function generateCaptchaSVG(captcha) {

    const width = 260;

    const height = 90;

    let svg = `
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="${width}"
        height="${height}"
    >

    <rect
        width="100%"
        height="100%"
        fill="#f4f4f4"
    />
    `;


    // ========================================================
    // NOISE LINES
    // ========================================================

    for (
        let i = 0;
        i < 8;
        i++
    ) {

        const x1 =
            Math.random() *
            width;

        const y1 =
            Math.random() *
            height;

        const x2 =
            Math.random() *
            width;

        const y2 =
            Math.random() *
            height;

        svg += `
        <line
            x1="${x1}"
            y1="${y1}"
            x2="${x2}"
            y2="${y2}"
            stroke="#777"
            stroke-width="1"
            opacity="0.45"
        />
        `;
    }


    // ========================================================
    // NOISE DOTS
    // ========================================================

    for (
        let i = 0;
        i < 80;
        i++
    ) {

        const x =
            Math.random() *
            width;

        const y =
            Math.random() *
            height;

        svg += `
        <circle
            cx="${x}"
            cy="${y}"
            r="1"
            fill="#555"
            opacity="0.45"
        />
        `;
    }


    // ========================================================
    // CAPTCHA CHARACTERS
    // ========================================================

    for (
        let i = 0;
        i < captcha.length;
        i++
    ) {

        const x =
            35 + i * 43;

        const y =
            58 +
            (Math.random() * 14 - 7);

        const rotation =
            Math.floor(
                Math.random() * 31
            ) - 15;

        svg += `
        <text
            x="${x}"
            y="${y}"
            font-size="38"
            font-family="Arial"
            font-weight="bold"
            transform="rotate(
                ${rotation}
                ${x}
                ${y}
            )"
            fill="#222"
        >
            ${captcha[i]}
        </text>
        `;
    }


    svg += `</svg>`;

    return svg;
}


module.exports = {
    generateCaptcha,
    generateCaptchaSVG
};