let captchaId = null;

let startTime = 0;

let attempts = 0;

let mouseEvents = 0;

/* Elements */

const captchaText = document.getElementById("captchaText");

const captchaInput = document.getElementById("captchaInput");

const captchaForm = document.getElementById("captchaForm");

const refreshBtn = document.getElementById("refreshBtn");

const botSimulationBtn = document.getElementById("botSimulationBtn");

const result = document.getElementById("result");

const honeypot = document.getElementById("website");

/* Analytics */

const responseMetric = document.getElementById("responseMetric");

const mouseMetric = document.getElementById("mouseMetric");

const attemptMetric = document.getElementById("attemptMetric");

const honeypotMetric = document.getElementById("honeypotMetric");

const riskScore = document.getElementById("riskScore");

const classification = document.getElementById("classification");

/*
    LOAD CAPTCHA
*/

async function loadCaptcha() {
  try {
    const response = await fetch("/api/captcha");

    if (!response.ok) {
      throw new Error("CAPTCHA request failed");
    }

    const data = await response.json();

    captchaId = data.id;

    captchaText.textContent = data.captcha;

    captchaInput.value = "";

    honeypot.value = "";

    startTime = Date.now();

    attempts = 0;

    mouseEvents = 0;

    result.className = "";

    result.textContent = "";

    
  } catch (error) {
    result.className = "error";

    result.textContent = "Unable to load CAPTCHA.";
  }
}

/*
    RESET ANALYTICS
*/

    function resetAnalytics() {
  responseMetric.textContent = "—";

  mouseMetric.textContent = "—";

  attemptMetric.textContent = "—";

  honeypotMetric.textContent = "—";

  riskScore.textContent = "—";

  classification.textContent = "WAITING";
}

/*
    MOUSE TRACKING
*/

document.addEventListener("mousemove", function () {
  mouseEvents++;
});

/*
    DISPLAY ANALYTICS
*/

function showAnalytics(
  responseTime,
  attemptsValue,
  mouseEventsValue,
  honeypotFilled,
  risk,
) {
  responseMetric.textContent = (responseTime / 1000).toFixed(2) + " sec";

  mouseMetric.textContent = mouseEventsValue;

  attemptMetric.textContent = attemptsValue;

  honeypotMetric.textContent = honeypotFilled ? "⚠ FILLED" : "✓ EMPTY";

  riskScore.textContent = risk ? risk.score + " / 100" : "—";

  if (risk) {
    classification.textContent = risk.classification;

    if (risk.classification.includes("BOT")) {
      classification.style.color = "#fca5a5";

      classification.style.background = "rgba(239,68,68,0.08)";
    } else {
      classification.style.color = "#86efac";

      classification.style.background = "rgba(34,197,94,0.08)";
    }
  }
}

/*
    NORMAL HUMAN VERIFICATION
*/

captchaForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  attempts++;

  const responseTime = Date.now() - startTime;

  const data = {
    id: captchaId,

    answer: captchaInput.value,

    honeypot: honeypot.value,

    responseTime: responseTime,

    attempts: attempts,

    mouseEvents: mouseEvents,
  };

  await sendVerification(data, false);
});

/*
    SEND VERIFICATION
*/

async function sendVerification(data, simulationMode) {
  try {
    const response = await fetch("/api/verify", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(data),
    });

    const dataResult = await response.json();

    /*
            Update analytics
        */

    showAnalytics(
      data.responseTime,

      data.attempts,

      data.mouseEvents,

      Boolean(data.honeypot),

      dataResult.risk,
    );

    /*
            Human
        */

    if (dataResult.success) {
      result.className = "success";

      result.innerHTML = `

                <strong>
                    ✓ HUMAN VERIFIED
                </strong>

                <br>

                Access Granted

                <br>

                Risk Score:
                ${dataResult.risk.score}

            `;
    } else {

    /*
            Bot / Failed
        */
      result.className = "error";

      let message = `

                <strong>
                    ✕ ACCESS DENIED
                </strong>

                <br>

                ${dataResult.message}

            `;

      if (dataResult.risk) {
        message += `

                    <br>

                    Risk Score:
                    ${dataResult.risk.score}

                    <br>

                    Classification:
                    ${dataResult.risk.classification}

                `;
      }

      result.innerHTML = message;

      /*
                Only regenerate CAPTCHA
                after bot simulation
                or failed verification.
            */

      setTimeout(loadCaptcha, 2000);
    }
  } catch (error) {
    result.className = "error";

    result.textContent = "Server error. Please try again.";
  }
}

/*
    BOT SIMULATION
*/

botSimulationBtn.addEventListener("click", async function () {
  /*
            Generate suspicious
            automated behaviour.
        */

  const botResponseTime = Math.floor(Math.random() * 400) + 300;

  const botAttempts = 3;

  const botMouseEvents = 0;

  /*
            Fill honeypot
            to simulate an automated
            form-filling bot.
        */

  honeypot.value = "https://automated-bot.example";

  /*
            Use correct CAPTCHA answer
            deliberately.

            This proves that even if
            a bot knows the CAPTCHA,
            behavioural checks can
            still detect suspicious activity.
        */

  const correctAnswer = captchaText.textContent;

  const botData = {
    id: captchaId,

    answer: correctAnswer,

    honeypot: honeypot.value,

    responseTime: botResponseTime,

    attempts: botAttempts,

    mouseEvents: botMouseEvents,
  };

  /*
            Show simulation state
        */

  result.className = "error";

  result.innerHTML = `

            <strong>
                🤖 BOT SIMULATION RUNNING
            </strong>

            <br>

            Simulating automated behaviour...

        `;

  botSimulationBtn.disabled = true;

  /*
            Small delay so the
            demonstration feels real.
        */

  setTimeout(async function () {
    await sendVerification(botData, true);

    botSimulationBtn.disabled = false;
  }, 800);
});

/*
    REFRESH CAPTCHA
*/

refreshBtn.addEventListener("click", function () {
  honeypot.value = "";

  loadCaptcha();
});

/*
    INITIAL LOAD
*/

loadCaptcha();
