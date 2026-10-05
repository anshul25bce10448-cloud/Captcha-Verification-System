const requests =
    new Map();


const WINDOW_MS =
    60 * 1000;


const MAX_REQUESTS =
    30;


function checkRateLimit(ip) {

    const now =
        Date.now();


    if (
        !requests.has(ip)
    ) {

        requests.set(
            ip,
            []
        );
    }


    const timestamps =
        requests.get(ip);


    const recentRequests =
        timestamps.filter(
            timestamp =>
                now - timestamp <
                WINDOW_MS
        );


    recentRequests.push(
        now
    );


    requests.set(
        ip,
        recentRequests
    );


    if (
        recentRequests.length >
        MAX_REQUESTS
    ) {

        return false;
    }


    return true;
}


module.exports = {
    checkRateLimit
};