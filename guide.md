# Manager Feedback Coach — Learning Guide

This is a practice project for learning how to build a voice-enabled web app in small, understandable pieces.

The app helps a manager practise a difficult feedback conversation with a simulated employee called Rohit. The current scenario is repeated lateness to a daily stand-up.

## How we are building it

We are deliberately not building everything at once. Each step should:

- add one useful piece of the product;
- teach one or two ideas clearly;
- work without depending on future features; and
- end in a small Git commit.

This makes the project easier to understand, test, and change.

## The application at a glance

```text
Manager using the browser
  ├─ Context: see the facts for the scenario
  ├─ Prepare: write a clear feedback opening
  ├─ Rehearse: see and hear a practice conversation
  └─ Debrief: receive practical coaching (future)

Browser features
  ├─ React interface and transcript state
  ├─ Browser text-to-speech for Rohit
  └─ Browser speech recognition for the manager (future)

Local server (future)
  └─ Keeps the AI API key private and asks an AI model for adaptive replies
```

For now, the browser uses fixed sample replies. That lets us learn the user experience before we add a microphone or AI model.

## Where the important code lives

| Location | Purpose |
| --- | --- |
| `src/App.jsx` | The screens, navigation, and current conversation state |
| `src/data/employee_record.json` | The synthetic employee record used in this prototype |
| `src/data/employeeRecord.js` | Adapts the record data into a shape the UI can use |
| `src/data/sampleTranscript.js` | Fixed manager and employee turns for rehearsal |
| `src/lib/prepareFeedback.js` | SBI checks and safe-coaching guidance |
| `src/hooks/useSpeechSynthesis.js` | Reusable browser text-to-speech behaviour |
| `src/hooks/useSpeechRecognition.js` | Reusable browser speech-to-text behaviour |

## Completed steps

### 1. Context screen

**Summary:** We created the basic React app and the first screen for understanding the scenario before practising it.

**What changed:**

- Added the app header and four-stage navigation.
- Added a permanent notice that this is a simulation, not a prediction of a real employee.
- Added the Context screen with observable evidence and clear boundaries for topics that should not be used in the conversation.

**What to learn:** A React screen is just a component that receives data and turns it into visible UI. Starting with the context makes it harder to accidentally base feedback on assumptions about a person.

**Commit:** `dc01319 feat: add employee context screen`

### 2. Replaceable mock employee record

**Summary:** We added a detailed but clearly synthetic employee record so the app has realistic facts to practise with.

**What changed:**

- Added `employee_record.json` with Rohit's role, late-arrival examples, past expectation, and safe practice boundaries.
- Added `employeeRecord.js`, an adapter between the raw JSON file and the UI.
- Marked the record as mock data in the application.

**What to learn:** Keeping raw data separate from the screen is useful. When a real record arrives, we can replace the JSON file and adjust one adapter if its shape is different, instead of rewriting the UI.

**Commit:** `715b931 feat: add replaceable mock employee record`

### 3. Rehearsal transcript

**Summary:** We built the core conversation as visible data before adding voice or AI.

**What changed:**

- Added a Rehearse screen with clearly labelled manager and simulated-employee turns.
- Added fixed sample turns and controls to reveal the next turn or reset the conversation.
- Stored the transcript in React state in `App.jsx`.

**What to learn:** The transcript is the centre of the product. Later, both the microphone and AI responses will add turns to this same list. Building it first gives later features a reliable place to connect.

**Commit:** `e2eefd4 feat: add rehearsal transcript state`

### 4. Prepare with SBI guidance

**Summary:** We added a writing space that helps a manager make their opening specific, fair, and work-focused.

**What changed:**

- Added the Prepare screen and a starter opening.
- Added a lightweight check for Situation, Behaviour, Impact, and a requested change.
- Added safety guidance for health topics, personality labels, PIP/manage-out framing, and anonymous peer feedback.

**What to learn:** A small rule-based helper is enough for clear feedback at this stage. It is easier to test and explain than asking AI to judge every sentence.

**Commit:** `5961612 feat: add SBI preparation guidance`

### 5. Simulated employee speech playback

**Summary:** Rohit's latest sample reply can now be spoken by the browser.

**What changed:**

- Added `useSpeechSynthesis`, a small reusable hook around the browser's `speechSynthesis` API.
- Added Play and Stop controls in Rehearse.
- Added a live status message such as “Rohit is speaking — simulated employee.”
- Used the existing transcript as the source of the spoken text.

**What to learn:** The browser can speak text without an AI provider. We keep the speech code in a hook so it can be reused later when the manager interrupts Rohit.

**Commit:** `ec907c5 feat: add employee speech playback`

### 6. Manager push-to-talk

**Summary:** The manager can now create a spoken turn with the browser microphone.

**What changed:**

- Added `useSpeechRecognition`, a reusable hook around the browser's `SpeechRecognition` API.
- Added Start speaking and Finish turn controls in Rehearse.
- Showed live transcribed words before the manager finishes.
- Added the finished words as a clearly labelled manager turn in the transcript.
- Added useful messages for unavailable speech recognition, permission, microphone, and network problems.

**What to learn:** Speech recognition gives partial words while the user is talking and final words when it is confident. We only add the turn after an explicit Finish turn click, so a pause for thought does not normally end the manager's turn.

**Commit:** `a3494bf feat: add manager speech transcription`

## Next step

Connect employee playback and manager speech into one turn-taking flow, including interruption.

The planned behaviour is:

```text
Rohit is speaking
  → manager chooses “Interrupt and speak”
  → Rohit's audio stops
  → manager microphone starts
  → interrupted state is recorded in the transcript
```

The push-to-talk step remains manual. We will reuse that behaviour so interruption is explicit and easy to understand.

## Future steps

1. Add a local Node server and an AI provider for adaptive employee replies.
2. Add a structured Debrief screen based on the completed transcript.
3. Test difficult cases and document the app's limits and tradeoffs.

## How to read this guide

You only need to focus on the latest completed step and the next step. When we implement another piece, we will add a new section here with its summary, changes, learning point, and commit.
