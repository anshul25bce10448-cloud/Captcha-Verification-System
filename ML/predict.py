import os
import sys
import json
import joblib
import pandas as pd


# ============================================================
# MODEL PATH
# ============================================================

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

MODEL_PATH = os.path.join(
    BASE_DIR,
    "model.pkl"
)


# ============================================================
# LOAD MODEL
# ============================================================

model = joblib.load(
    MODEL_PATH
)


# ============================================================
# READ JSON FROM NODE.JS
# ============================================================

input_data = json.loads(
    sys.stdin.read()
)


# ============================================================
# CREATE DATAFRAME
# ============================================================

features = pd.DataFrame({

    "response_time": [
        float(
            input_data.get(
                "response_time",
                0
            )
        )
    ],

    "attempts": [
        int(
            input_data.get(
                "attempts",
                1
            )
        )
    ],

    "honeypot": [
        int(
            input_data.get(
                "honeypot",
                0
            )
        )
    ],

    "mouse_events": [
        int(
            input_data.get(
                "mouse_events",
                0
            )
        )
    ]

})


# ============================================================
# PREDICT
# ============================================================

prediction = int(
    model.predict(features)[0]
)


# ============================================================
# CONFIDENCE
# ============================================================

probabilities = (
    model.predict_proba(features)[0]
)

confidence = float(
    max(probabilities)
)


# ============================================================
# RESULT
# ============================================================

result = {

    "prediction":
        prediction,

    "classification":
        "BOT"
        if prediction == 1
        else "HUMAN",

    "confidence":
        round(
            confidence,
            4
        )

}


# ============================================================
# SEND RESULT TO NODE.JS
# ============================================================

print(
    json.dumps(result)
)