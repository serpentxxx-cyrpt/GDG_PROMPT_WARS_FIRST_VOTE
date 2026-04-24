# Technical Documentation: "The First Vote"
**Event:** GDG Prompt Wars
**Project:** 3D Election Simulator & Civic Educator

---

## 1. Tools Used
The following tools were instrumental in the development of this project:
*   **Gemini API (1.5 Pro/Flash):** Core Generative AI for narrative guidance and scenario evaluation.
*   **Antigravity (GenAI Assistant):** Primary architectural partner for code implementation and deployment.
*   **Firebase (Hosting & Firestore):** Cloud infrastructure for web deployment and data persistence.
*   **Vite + React:** Modern frontend framework for high-performance UI.
*   **Three.js (@react-three/fiber):** 3D engine for creating the immersive polling booth environment.

## 2. Selection Rationale
*   **Gemini API:** Selected over other LLMs for its native integration with the Google ecosystem and its high speed/low latency for real-time NPC interactions.
*   **Firebase:** Chosen for its seamless integration with GitHub Actions, allowing for a robust CI/CD pipeline that ensures the project is always production-ready.
*   **Three.js:** Necessary to provide a "premium" feel that moves beyond standard 2D educational forms, making the simulation memorable.
*   **Antigravity:** Used to handle complex logic such as the **Promise-based Audio Queue** and **Global Deduplication**, allowing me to focus on the civic narrative and UX design.

## 3. Evolution of Prompts
The prompting strategy underwent three major iterations to achieve the current level of polish:

### Iteration 1: Simple Instruction
*   **Prompt:** `"Tell the user to enter their age."`
*   **Result:** Repetitive audio and generic text that felt like a robot reading a manual.

### Iteration 2: Persona-Driven
*   **Prompt:** `"You are Vivek, a wise civic guide. Narrate Level 0 and wait for the user to click 'Done'."`
*   **Result:** Better tone, but the AI would speak "Done confirmed" before the user actually clicked the button because it didn't understand the state-gate.

### Iteration 3: Logic-Gated System Prompt (Final)
*   **Prompt:** `"You are Vivek. Respond only to the current 'active_step' provided in the state object. Do not confirm an action until 'action_success' is true. Format all output for a sequential audio queue to prevent overlapping voices."`
*   **Result:** A perfectly synchronized experience where the AI waits for user interaction before proceeding.

## 4. GenAI vs. Human Design
To ensure genuine adoption and learning, the labor was divided as follows:

### Human Designed (Participant)
*   **Narrative Design:** Writing the specific election scenarios (bribery, impersonation, booth protocol).
*   **3D Scene Composition:** Designing the layout of the polling booth and the aesthetic of the "Human3D" characters.
*   **UX Flow:** Determining how a first-time voter should move from the "Registration Portal" to the "Electronic Voting Machine."

### GenAI Handled (AI Assistant)
*   **Sequential Logic:** Implementing the complex `audioManager.js` and `tts.js` queue systems.
*   **Boilerplate & Utilities:** Generating the Firebase configuration and GitHub Action YAML workflows.
*   **State Management:** Handling the synchronization between React state and Three.js animations.

---
*This document serves as proof of intentional tool usage and architectural planning for the GDG Prompt Wars.*
