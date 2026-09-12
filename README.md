# Dynamic CAPTCHA Verification System
(Group No. 101)

# 👥 Team

**VIT Bhopal University**

| Name            | Registration Number | Role        |
| --------------- | ------------------- | ----------- |
| Rakshita Ranjan | 25BCE10602          | Team Lead   |
| Isha Ojha       | 25BCE11037          | Team Member |
| Sanskriti       | 25BCE10932          | Team Member |
| Kavya Gupta     | 25BCE10453          | Team Member |
| Anshul Kumar    | 25BCE10448          | Team Member |

---

A lightweight and configurable **Dynamic CAPTCHA Verification System** designed to study the **security–usability trade-off in human–bot differentiation**.

The system generates CAPTCHA challenges using controlled visual variations such as randomized characters, character rotation, positional changes, background noise, and interference elements. Different difficulty levels can be configured to evaluate how increasing visual complexity affects legitimate human users.

---

## 📌 Project Overview

CAPTCHAs are commonly used as an additional security layer to distinguish human users from automated bots.

However, increasing CAPTCHA complexity can improve resistance against automated recognition while simultaneously making the challenge harder for legitimate users.

This project focuses on this **security–usability trade-off** by implementing a dynamic CAPTCHA mechanism with configurable visual difficulty.

The system allows CAPTCHA challenges to be generated at **Low, Medium, and High difficulty levels**, followed by server-side validation and usability evaluation.

---

## 🎯 Research Objective

The primary objective of this research is:

> **To design and evaluate a dynamic CAPTCHA mechanism that introduces controlled visual variations while maintaining acceptable usability for legitimate users.**

The system is designed to investigate how different levels of visual complexity influence:

* Human success rate
* CAPTCHA solving time
* Error rate
* Number of attempts

The project therefore treats CAPTCHA difficulty as an experimental variable rather than simply as a fixed security mechanism.

---

## ✨ Key Features

### 🔐 Dynamic CAPTCHA Generation

CAPTCHA challenges are generated dynamically rather than relying on a fixed set of images.

### 🔤 Randomized Characters

Characters are randomized for every challenge to reduce predictability.

### 🔄 Character Rotation

Individual characters can be rotated at different angles to increase visual variation.

### 📍 Positional Variation

Characters are placed at varying positions instead of following a completely uniform arrangement.

### 🌫️ Background Noise

Noise elements are introduced into CAPTCHA images to make automated visual recognition more difficult.

### 🚧 Interference Elements

Additional visual interference can be incorporated into the CAPTCHA to increase recognition complexity.

### ⚙️ Configurable Difficulty

The CAPTCHA system supports three experimental difficulty levels:

| Difficulty | Visual Complexity                                  |
| ---------- | -------------------------------------------------- |
| **Low**    | Minimal distortion and interference                |
| **Medium** | Moderate rotation, positional variation, and noise |
| **High**   | Greater visual complexity and interference         |

### 🛡️ Server-Side Validation

CAPTCHA responses are validated on the server rather than relying solely on client-side verification.

### ⏱️ CAPTCHA Expiration

CAPTCHA challenges can be configured to expire after a defined period.

### 🔢 Attempt Limitation

The system can restrict the number of attempts allowed for a CAPTCHA challenge.

---

# 🧠 System Architecture

The proposed system follows a **challenge–response verification model**.

```text
                 ┌─────────────────────┐
                 │       User          │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │ CAPTCHA Request     │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │ Difficulty          │
                 │ Selection           │
                 └──────────┬──────────┘
                            │
                            ▼
              ┌────────────────────────────┐
              │ Dynamic CAPTCHA Generator  │
              │                            │
              │ • Random Characters        │
              │ • Rotation                 │
              │ • Position Variation       │
              │ • Background Noise         │
              │ • Interference             │
              └──────────────┬─────────────┘
                             │
                             ▼
                 ┌─────────────────────┐
                 │ CAPTCHA Presented   │
                 │ to User             │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │ User Response       │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │ Server-Side         │
                 │ Validation          │
                 └──────────┬──────────┘
                            │
                  ┌─────────┴─────────┐
                  ▼                   ▼
            ┌───────────┐       ┌───────────┐
            │   Valid   │       │  Invalid  │
            └───────────┘       └───────────┘
```

---

# 🔬 CAPTCHA Generation Methodology

The CAPTCHA generation process introduces controlled visual variations into the challenge.

The major components are:

### 1. Random Character Generation

A random sequence of characters is generated for every CAPTCHA challenge.

### 2. Character Rotation

Characters can be rotated individually to introduce orientation variation.

### 3. Positional Variation

The position of characters can be varied within the CAPTCHA image.

### 4. Background Noise

Noise patterns are introduced into the CAPTCHA background.

### 5. Interference

Visual interference elements are added to increase recognition difficulty.

### 6. Difficulty Configuration

The intensity of these visual transformations is controlled according to the selected difficulty level.

---

# 📊 Difficulty Levels

The system uses three configurable difficulty levels.

| Feature                 | Low |   Medium | High |
| ----------------------- | --: | -------: | ---: |
| Character Randomization |   ✓ |        ✓ |    ✓ |
| Character Rotation      | Low | Moderate | High |
| Position Variation      | Low | Moderate | High |
| Background Noise        | Low | Moderate | High |
| Interference            | Low | Moderate | High |
| Visual Complexity       | Low |   Medium | High |

The purpose of these levels is to provide different experimental conditions for studying the relationship between CAPTCHA complexity and human usability.

---

# 📈 Research Evaluation

The system can be evaluated using human participants across different CAPTCHA difficulty levels.

The following metrics are considered:

### Human Success Rate

Measures the percentage of CAPTCHA challenges successfully solved by human participants.

### Average Solving Time

Measures the average time required by a participant to correctly solve a CAPTCHA.

### Error Rate

Measures the frequency of incorrect CAPTCHA responses.

### Number of Attempts

Measures how many attempts are required before successful verification.

---

## 📊 Experimental Comparison

The collected results can be used to compare the three difficulty levels.

Example research questions include:

* Does increasing CAPTCHA difficulty reduce human success rate?
* Does increased visual complexity increase solving time?
* How does CAPTCHA difficulty affect error rate?
* How many attempts are typically required at each difficulty level?
* At what point does increased security complexity negatively affect usability?

> **Note:** Experimental values should be added only after actual user testing. No research results are fabricated in this repository.

---

# 🛡️ Security Considerations

The system incorporates several mechanisms intended to strengthen CAPTCHA verification:

| Threat / Issue              | Mitigation                                           |
| --------------------------- | ---------------------------------------------------- |
| Random guessing             | Attempt limitation                                   |
| CAPTCHA replay              | CAPTCHA expiration                                   |
| Predictable challenges      | Randomized generation                                |
| OCR recognition             | Visual distortion and noise                          |
| Computer-vision recognition | Rotation, noise, position variation and interference |
| Human-assisted solving      | Not completely addressed                             |
| Behavioural bots            | Future scope                                         |

The visual techniques provide an additional challenge to automated recognition, but they should **not be interpreted as complete protection against advanced AI-based attacks**.

---

# ⚖️ Security–Usability Trade-off

A central focus of this project is the relationship between **security and usability**.

Increasing CAPTCHA complexity may make automated recognition more difficult, but it can also make the CAPTCHA harder for legitimate users.

Conceptually:

```text
          Increasing Visual Complexity
                       │
          ┌────────────┴────────────┐
          ▼                         ▼
   Greater Challenge           Greater User
   for Automated Systems       Difficulty
          │                         │
          ▼                         ▼
    Potential Security         Potential
       Improvement             Usability Loss
```

Therefore, the goal is not simply to create the most complicated CAPTCHA possible.

Instead, the research investigates whether a **balanced difficulty level** can provide reasonable resistance to automated recognition while maintaining acceptable human usability.

---

# ♿ Accessibility Considerations

Traditional visual CAPTCHAs can create accessibility challenges for users with visual impairments or other disabilities.

Accessibility is therefore identified as an important limitation of the current visual CAPTCHA approach and an area for future development.

Potential future improvements include:

* Alternative challenge formats
* Audio-based verification
* Accessibility-aware difficulty
* Reduced visual complexity where appropriate
* Risk-based verification that avoids unnecessary CAPTCHA challenges

---

# ⚠️ Limitations

The current approach has several limitations.

### OCR-Based Attacks

Advanced OCR systems may still be capable of recognizing distorted characters.

### Computer-Vision Attacks

Modern computer-vision techniques may potentially learn to recognize CAPTCHA patterns despite visual distortions.

### Human-Assisted Solving

CAPTCHAs may still be solved through human-assisted services.

### Accessibility

Visual CAPTCHAs may be difficult for users with visual or other accessibility requirements.

### Security–Usability Trade-off

Increasing visual complexity can negatively affect legitimate users.

Therefore, the proposed system should be considered a **lightweight additional security layer**, rather than a complete solution to automated attacks.

---

# 🚀 Future Scope

The system can be extended beyond static visual characteristics toward behavioural and intelligent bot detection.

### 🖱️ Behavioural Analysis

User interaction patterns can be analyzed to distinguish human interaction from automated behaviour.

### 🖱️ Mouse Dynamics

Mouse movement characteristics such as movement trajectory, speed, pauses, and interaction patterns could be analyzed.

### ⌨️ Keystroke Dynamics

Typing behaviour, timing patterns, and key intervals could provide additional behavioural signals.

### 🤖 Machine Learning-Based Bot Detection

Machine-learning models could be trained using CAPTCHA interaction and behavioural features to identify suspicious users.

### 🧠 Deep Learning

Deep-learning approaches could be investigated for detecting sophisticated automated interactions and improving CAPTCHA generation.

### 🔄 Adaptive Difficulty

The CAPTCHA difficulty could dynamically change according to the estimated risk level of the user.

For example:

```text
Low Risk
   ↓
Low CAPTCHA Difficulty
   ↓
Successful Verification

        OR

Suspicious Behaviour
   ↓
Higher CAPTCHA Difficulty
   ↓
Additional Verification
```

### ♿ Accessibility-Aware CAPTCHA

Future versions could provide alternative verification mechanisms for users who cannot comfortably solve visual CAPTCHAs.

### 🎯 Risk-Based Verification

Instead of presenting the same CAPTCHA challenge to every user, the system could evaluate contextual and behavioural risk and request stronger verification only when necessary.

### 🔐 Privacy-Preserving Behaviour Analysis

Future behavioural analysis should consider privacy by minimizing collected data and avoiding unnecessary storage of identifiable interaction information.

---

# 💻 Technologies Used

> **Important:** Keep only the technologies that are actually present in your implementation.

### Programming Languages

* **Python** – CAPTCHA generation, validation, configuration and research evaluation
* **HTML** – Web interface structure
* **CSS** – Interface styling
* **JavaScript** – Client-side interaction and dynamic interface behaviour

### Python Libraries / Frameworks

Depending on the implementation:

* **Flask** – Web application and server-side request handling
* **Pillow (PIL)** – CAPTCHA image generation and visual transformations
* **OpenCV** – Image processing and visual manipulation
* **NumPy** – Numerical and image-related operations
* **Matplotlib** – Visualization of research results

---

# 📁 Suggested Project Structure

```text
Captcha-Verification-system/
│
├── README.md
├── LICENSE
├── requirements.txt
│
├── app/
│   ├── captcha_generator.py
│   ├── captcha_validator.py
│   ├── difficulty.py
│   ├── security.py
│   └── routes.py
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── tests/
│   ├── test_generation.py
│   ├── test_validation.py
│   ├── test_expiration.py
│   └── test_attempt_limits.py
│
├── research/
│   ├── methodology.md
│   ├── experiment-design.md
│   ├── dataset/
│   ├── results/
│   └── figures/
│
├── docs/
│   ├── system-architecture.png
│   ├── workflow.png
│   └── difficulty-levels.png
│
└── screenshots/
    ├── low-difficulty.png
    ├── medium-difficulty.png
    └── high-difficulty.png
```

---

# 🧪 Testing

The system should be tested for both functionality and security-related behaviour.

Recommended test cases include:

* CAPTCHA generation
* Random character generation
* Character rotation
* Positional variation
* Noise generation
* Interference generation
* Difficulty-level configuration
* Correct CAPTCHA response
* Incorrect CAPTCHA response
* Expired CAPTCHA
* Maximum-attempt restriction
* CAPTCHA regeneration
* Server-side validation

---

# 🔎 Research Gap

Existing CAPTCHA approaches demonstrate an ongoing challenge between automated attack resistance and human usability.

Highly distorted CAPTCHAs can increase recognition difficulty for automated systems but may also negatively affect legitimate users.

This project addresses this gap by focusing on a **configurable dynamic CAPTCHA system** in which visual complexity can be systematically varied and evaluated using measurable human usability metrics.

The research therefore focuses not only on CAPTCHA generation but also on evaluating the effect of **difficulty on human interaction**.

---

# 📚 Research Context

The project is based on research surrounding:

* CAPTCHA and Human Interactive Proofs
* reCAPTCHA
* Text-based CAPTCHA security
* OCR and computer-vision attacks
* CAPTCHA usability
* Behavioural biometrics
* Mouse dynamics
* Keystroke dynamics
* Machine-learning-based bot detection

The implementation focuses specifically on **dynamic visual CAPTCHA generation and human usability evaluation**.

---

# 📋 Research Metrics Summary

| Metric               | Purpose                                     |
| -------------------- | ------------------------------------------- |
| Human Success Rate   | Measures successful human verification      |
| Average Solving Time | Measures usability and challenge difficulty |
| Error Rate           | Measures incorrect responses                |
| Number of Attempts   | Measures verification difficulty            |

---

# 🔮 Overall Research Direction

The project can evolve from a **visual CAPTCHA verification mechanism** into a broader **adaptive human–bot differentiation system**.

```text
Dynamic CAPTCHA
      │
      ▼
Visual Difficulty Levels
      │
      ▼
Human Usability Evaluation
      │
      ▼
Behavioural Data
      │
      ▼
Machine Learning
      │
      ▼
Adaptive Risk-Based Verification
```

This progression could allow future versions to combine CAPTCHA challenges with behavioural signals instead of relying solely on visual complexity.





# 📜 License

This project is released under the license included in this repository.

See [`LICENSE`](LICENSE) for details.

---

# ⭐ Conclusion

The **Dynamic CAPTCHA Verification System** provides a lightweight and configurable approach for studying human–bot differentiation.

By introducing controlled visual variations and multiple difficulty levels, the system provides an experimental platform for investigating the relationship between **CAPTCHA complexity, security, and human usability**.

The project does not claim to completely eliminate advanced automated attacks. Instead, it establishes a foundation that can be extended with **behavioural analysis, machine learning, adaptive difficulty, accessibility-aware verification, and risk-based authentication**.
