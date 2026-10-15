# Prototype write-up

## Decisions

I built the smallest complete rehearsal loop for one scenario: prepare an SBI opening, speak it aloud, hear a simulated employee, interrupt when needed, and receive a transcript-based debrief. The interface keeps the employee record, visible transcript, and permanent “simulation” label on screen because the model must not be mistaken for a prediction about a real person.

I used browser `SpeechRecognition` and `speechSynthesis` to avoid another account, cost, or installation during a live demo. Push-to-talk was the turn-taking choice: the manager explicitly selects **Finish turn**, which is less likely to cut off a pause for thought than silence detection. Rohit's speech begins with “Rohit says” and the screen labels every turn. Interrupting stops browser speech before microphone recognition begins and marks that employee turn as interrupted.

Gemini runs only on the local Node server, never in browser code. The server tries a configured model list only when the previous model reports a quota-specific `429 RESOURCE_EXHAUSTED`; it records Gemini's retry delay and falls back to a deterministic local response if all configured models are unavailable. This makes the demo usable without a key or during free-tier limits.

The Debrief is intentionally deterministic. It checks for situation, behaviour, impact, and an agreed next step, then quotes actual manager wording. This is transparent and remains available during provider failures. It is coaching, not an employee-performance assessment.

## Assumptions

- The supplied employee record is synthetic and is the only source of scenario facts.
- The manager rehearses alone in Edge or Chrome with a microphone and audio output available.
- A browser speech-start measurement is sufficient to report first-sound latency honestly for this prototype.
- A local, rule-based debrief is preferable to unreliable AI analysis for the first version.

## Deliberately left out and next steps

There is no authentication, persistence, multi-scenario support, server deployment, streaming output, or company HR workflow. I would next add an optional server-side structured AI debrief, preserve model/reply metadata for evaluation, add automated tests around fallback logic, and replace browser speech APIs with enterprise-approved speech services if privacy, reliability, or voice quality became important.

## Weakest areas

Browser speech recognition varies by browser and network. The local employee follows a small set of rules and therefore has limited conversational depth; Gemini quality and availability are outside the application's control. The first-sound number is measured in the UI after a real turn, so it should be recorded from the intended demo machine rather than claimed in advance.

## Use of AI tools

AI tools were used to help plan, implement, review, and explain the prototype. The product decisions, safe data boundaries, fallbacks, and documented limitations are explicit in the code and this write-up.
