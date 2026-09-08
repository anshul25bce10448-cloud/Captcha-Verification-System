import pandas as pd

from sklearn.model_selection import train_test_split

from sklearn.ensemble import RandomForestClassifier

from sklearn.metrics import (
    accuracy_score,
    classification_report
)


# Load dataset

data = pd.read_csv("dataset.csv")


# Features

X = data[
    [
        "response_time",
        "attempts",
        "honeypot",
        "mouse_events"
    ]
]


# Target

y = data["label"]


# Split data

X_train, X_test, y_train, y_test = train_test_split(

    X,
    y,

    test_size=0.3,

    random_state=42,

    stratify=y
)


# Create model

model = RandomForestClassifier(

    n_estimators=100,

    random_state=42

)


# Train

model.fit(
    X_train,
    y_train
)


# Test

predictions = model.predict(X_test)

accuracy = accuracy_score(y_test, predictions)

print(
    "Model Accuracy:",
    round(accuracy * 100, 2),
    "%"
)


print("\nClassification Report:")

print(
    classification_report(
        y_test,
        predictions
    )
)


# Test examples

examples = pd.DataFrame({

    "response_time": [
        8000,
        700
    ],

    "attempts": [
        1,
        3
    ],

    "honeypot": [
        0,
        1
    ],

    "mouse_events": [
        30,
        0
    ]

})


predictions = model.predict(examples)

print("\nExample Predictions:")


for i, prediction in enumerate(
    predictions
):

    if prediction == 0:

        result = "HUMAN"

    else:

        result = "BOT"


    print(
        f"Example {i + 1}: {result}"
    )