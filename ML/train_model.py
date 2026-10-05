import os
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report


# ============================================================
# PATHS
# ============================================================

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

DATASET_PATH = os.path.join(
    BASE_DIR,
    "dataset.csv"
)

MODEL_PATH = os.path.join(
    BASE_DIR,
    "model.pkl"
)


# ============================================================
# LOAD DATASET
# ============================================================

print("\nLoading dataset...")

data = pd.read_csv(DATASET_PATH)

print("\nOriginal dataset:")
print(data)


# ============================================================
# CHECK REQUIRED COLUMNS
# ============================================================

required_columns = [
    "response_time",
    "attempts",
    "honeypot",
    "mouse_events",
    "label"
]

missing_columns = [
    column
    for column in required_columns
    if column not in data.columns
]

if missing_columns:

    raise ValueError(
        "Missing columns: "
        + ", ".join(missing_columns)
    )


# ============================================================
# REMOVE EMPTY ROWS
# ============================================================

print("\nMissing values before cleaning:")

print(
    data[required_columns].isnull().sum()
)


data = data.dropna(
    subset=required_columns
)


# ============================================================
# CONVERT FEATURES TO NUMERIC
# ============================================================

numeric_columns = [
    "response_time",
    "attempts",
    "honeypot",
    "mouse_events"
]

for column in numeric_columns:

    data[column] = pd.to_numeric(
        data[column],
        errors="coerce"
    )


# Remove rows that became invalid
data = data.dropna(
    subset=numeric_columns
)


# ============================================================
# NORMALIZE LABEL
# ============================================================

def normalize_label(value):

    value = str(value).strip().upper()

    if value in ["0", "HUMAN"]:
        return 0

    if value in ["1", "BOT", "SUSPICIOUS"]:
        return 1

    return None


data["label"] = data["label"].apply(
    normalize_label
)


# Remove unknown labels
data = data.dropna(
    subset=["label"]
)


data["label"] = data["label"].astype(int)


# ============================================================
# DATASET INFORMATION
# ============================================================

print("\nClean dataset:")
print(data)

print("\nDataset size:")
print(len(data))


print("\nLabel distribution:")

print(
    data["label"].value_counts()
)


# ============================================================
# CHECK CLASS DISTRIBUTION
# ============================================================

label_counts = data["label"].value_counts()


if len(label_counts) < 2:

    raise ValueError(
        "\nERROR: Your dataset contains only "
        "one class.\n\n"
        "You need BOTH classes:\n"
        "0 = HUMAN\n"
        "1 = BOT\n\n"
        "Add more HUMAN/BOT examples to dataset.csv."
    )


if label_counts.min() < 2:

    raise ValueError(
        "\nERROR: One class contains fewer "
        "than 2 samples.\n\n"
        "Each class needs at least 2 examples "
        "for stratified train/test splitting.\n\n"
        f"Current distribution:\n{label_counts}"
    )


# ============================================================
# FEATURES
# ============================================================

X = data[
    [
        "response_time",
        "attempts",
        "honeypot",
        "mouse_events"
    ]
]


# ============================================================
# TARGET
# ============================================================

y = data["label"]


# ============================================================
# TRAIN / TEST SPLIT
# ============================================================

X_train, X_test, y_train, y_test = train_test_split(

    X,
    y,

    test_size=0.3,

    random_state=42,

    stratify=y
)


print("\nTraining samples:")
print(len(X_train))

print("\nTesting samples:")
print(len(X_test))


# ============================================================
# RANDOM FOREST
# ============================================================

model = RandomForestClassifier(

    n_estimators=100,

    random_state=42

)


# ============================================================
# TRAIN
# ============================================================

print("\nTraining Random Forest...")

model.fit(
    X_train,
    y_train
)


# ============================================================
# TEST
# ============================================================

predictions = model.predict(
    X_test
)


accuracy = accuracy_score(
    y_test,
    predictions
)


print(
    "\nModel Accuracy:",
    round(
        accuracy * 100,
        2
    ),
    "%"
)


print(
    "\nClassification Report:"
)


print(
    classification_report(
        y_test,
        predictions,
        zero_division=0
    )
)


# ============================================================
# SAVE MODEL
# ============================================================

joblib.dump(
    model,
    MODEL_PATH
)


print(
    "\nModel saved successfully:"
)

print(
    MODEL_PATH
)