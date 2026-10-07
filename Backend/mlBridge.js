
const {
    spawn
} = require("child_process");

const path =
    require("path");


function predictWithML(data) {

    return new Promise(
        (resolve, reject) => {

            /*
             * IMPORTANT:
             *
             * The actual folder in the repository is
             * "ML" with capital letters.
             *
             * Vercel/Linux is case-sensitive.
             */

            const scriptPath =
                path.join(
                    __dirname,
                    "../ML/predict.py"
                );


            const python =
                spawn(
                    "python",
                    [scriptPath]
                );


            let output = "";

            let errorOutput = "";


            python.stdout.on(
                "data",
                chunk => {

                    output +=
                        chunk.toString();

                }
            );


            python.stderr.on(
                "data",
                chunk => {

                    errorOutput +=
                        chunk.toString();

                }
            );


            python.on(
                "error",
                error => {

                    reject(error);

                }
            );


            python.on(
                "close",
                code => {

                    if (
                        code !== 0
                    ) {

                        reject(
                            new Error(
                                errorOutput ||
                                "ML prediction failed"
                            )
                        );

                        return;
                    }


                    try {

                        const result =
                            JSON.parse(
                                output.trim()
                            );

                        resolve(
                            result
                        );

                    } catch (
                        error
                    ) {

                        reject(error);

                    }

                }
            );


            python.stdin.write(
                JSON.stringify(data)
            );


            python.stdin.end();

        }
    );
}


module.exports = {
    predictWithML
};
