const fs =
    require("fs");

const path =
    require("path");


const logDirectory =
    path.join(
        __dirname,
        "../logs"
    );


const logFile =
    path.join(
        logDirectory,
        "security.jsonl"
    );


if (
    !fs.existsSync(
        logDirectory
    )
) {

    fs.mkdirSync(
        logDirectory,
        {
            recursive: true
        }
    );
}


function logSecurityEvent(event) {

    const entry = {

        timestamp:
            new Date()
                .toISOString(),

        ...event

    };


    fs.appendFileSync(

        logFile,

        JSON.stringify(entry)
        + "\n"

    );
}


function readLogs() {

    if (
        !fs.existsSync(logFile)
    ) {

        return [];
    }


    const content =
        fs.readFileSync(
            logFile,
            "utf8"
        );


    if (
        !content.trim()
    ) {

        return [];
    }


    return content
        .trim()
        .split("\n")
        .map(line => {

            try {

                return JSON.parse(
                    line
                );

            } catch {

                return null;
            }

        })
        .filter(Boolean);
}


module.exports = {

    logSecurityEvent,

    readLogs

};