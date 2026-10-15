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
  └─ Debrief: receive practical coaching from the transcript

Browser features
  ├─ React interface and transcript state
  ├─ Browser text-to-speech for Rohit
  └─ Browser speech recognition for the manager

Local server
  ├─ Keeps the AI key private
  └─ Creates adaptive replies, or local practice replies without a key
```

The opening sample turns make the first rehearsal easy to explore. After the manager speaks, the browser adds an adaptive employee response when a provider is available.

## Where the important code lives

| Location | Purpose |
| --- | --- |
| `src/App.jsx` | The screens, navigation, and current conversation state |
| `src/data/employee_record.json` | The synthetic employee record used in this prototype |
| `src/data/employeeRecord.js` | Adapts the record data into a shape the UI can use |
| `src/data/sampleTranscript.js` | Fixed manager and employee turns for rehearsal |
| `src/lib/prepareFeedback.js` | SBI checks and safe-coaching guidance |
| `src/lib/debriefFeedback.js` | Deterministic transcript coaching for the Debrief screen |
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

### 7. Voice turn-taking and interruption

**Summary:** The manager can now take the floor while Rohit is speaking.

**What changed:**

- Changed Rohit's play button into “Interrupt and speak” while his browser voice is active.
- Stopped Rohit's audio before starting manager speech recognition.
- Marked Rohit's most recent reply as “Interrupted” in the visible transcript.
- Disabled the ordinary Start speaking action while Rohit is speaking, so the microphone does not accidentally capture the simulated employee voice.

**What to learn:** This is a small state machine in practice. The important rule is: stop one source of audio before starting another. That makes the conversation understandable for the person using it and keeps the transcript accurate.

**Commit:** `90d0fdf feat: support voice interruption`

### 8. Local server and adaptive employee replies

**Summary:** The browser can now ask a local server for Rohit's next reply after the manager finishes speaking.

**What changed:**

- Added a small Node server with one route: `POST /api/rehearse/reply`.
- Kept the Gemini API key on the server, never in browser code.
- Added a provider module that uses Gemini when `GEMINI_API_KEY` exists.
- Added a free, deterministic local practice provider when there is no API key.
- Added visible reply states: preparing, ready, and error.

**What to learn:** The browser manages the experience; the server manages secrets and calls outside services. The provider module gives us one place to change the AI model later without rewriting the screen or API route.

**Commit:** `ebb406b feat: add local rehearsal reply server`

### Trying adaptive replies

Run `pnpm dev`. This starts both the browser app and the local server.

It works immediately with the local practice provider. To use Gemini later, copy `.env.example` to `.env`, add `GEMINI_API_KEY`, and restart `pnpm dev`. The `.env` file is ignored by Git, so the key is not committed.

### 9. Complete Gemini replies

**Summary:** Gemini replies now reserve enough room for Rohit's spoken answer instead of occasionally stopping after its first word.

**What changed:**

- Increased the total response limit from 120 to 512 tokens.
- Told Gemini 3.8 Flash to use `low` thinking for this simple role-play task.

**Why:** Gemini's internal thinking and the visible reply share the same token limit. At 120 tokens, internal thinking could consume nearly all of the budget, leaving only a partial word such as “To”. This is not a good place for deep reasoning: a quick, natural employee response is more useful.

**What to learn:** A model's output limit is not always only the text a user sees. For thinking models, it can include hidden reasoning too. Match the reasoning level and token allowance to the task rather than setting a tiny limit just to make responses shorter.

**Commit:** `fix: prevent truncated Gemini replies`

### 10. Focused replies and automatic playback

**Summary:** Rohit now responds specifically to the manager's latest sentence and begins speaking the newly generated reply automatically.

**What changed:**

- Made the latest manager turn a clearly labelled, high-priority response target in the Gemini prompt.
- Instructed Gemini to answer the exact latest question, request, or concern instead of giving a generic acknowledgement.
- Added a browser effect that plays each newly generated Rohit reply once, after it appears in the transcript.
- Kept the Play button as a useful fallback to replay the latest response; it does not cause the automatic response to repeat.

**What to learn:** Context alone is not enough. In a conversation prompt, the model needs a clear indication of which message it should answer now. On the browser side, an effect is the right place to react to a new reply because it runs after React has added that reply to the transcript.

### 11. Retry an unavailable reply

**Summary:** If Rohit cannot reply, the app now lets the manager resend the last message.

**What changed:**

- Added a “Resend last manager message” button to the reply-error panel.
- Reused the saved conversation transcript for the retry, so the manager's message is not duplicated.
- Reused the normal reply and automatic-speech path when the retry succeeds.

**What to learn:** A retry should repeat the failed request, not repeat the user's action. Keeping the transcript in browser state lets us retry safely while preserving the conversation record.

### 12. Quota-aware model fallback

**Summary:** The server now tries a configured Gemini model chain and uses the built-in local reply when every Gemini option is temporarily unavailable.

**What changed:**

- Added `GEMINI_MODELS` to `.env`, keeping the ordered model list outside the source code.
- Tries 3.8 Flash, 3.6 Flash, 3.5 Flash Lite, then 3.1 Flash Lite in that order.
- Moves to the next model only after Gemini returns `429 RESOURCE_EXHAUSTED`.
- Stores each exhausted model's retry time in the running server, so later turns skip it until Gemini says it can be retried.
- Uses the existing local practice reply after every configured Gemini model is unavailable, and explains that fallback in the interface.

**What to learn:** Resilience should be precise. We fail over only for the error that means “this model's quota is exhausted,” not for every API error. This avoids hiding real setup or network problems while keeping the rehearsal usable during a quota pause.

### 13. Transcript debrief

**Summary:** The manager can now review a completed rehearsal and get practical, transcript-based coaching.

**What changed:**

- Enabled the Debrief stage and added a “Debrief this conversation” action in Rehearse.
- Added a clear readiness call based on situation, behaviour, impact, and an invited next step.
- Shows one quoted manager moment that worked and one quoted moment to improve.
- Provides a revised SBI opening and two constructive responses to likely pushbacks.
- Kept the first debrief deterministic and in the browser, so it remains available during API quota limits.

**What to learn:** The transcript is a useful source of evidence. A dependable first version can use small, transparent rules to point to actual wording before we decide whether AI-generated coaching adds enough value.

### 14. Demo readiness and realistic fallback

**Summary:** The prototype now has its demo materials, honest limitations, a first-sound measurement, and a more realistic local employee fallback.

**What changed:**

- Added a runbook, a short design write-up, and the required probe-results table.
- Made the local employee respond defensively on the first manager turn instead of agreeing immediately.
- Added an in-app first-sound measurement after a manager finishes a turn.
- Added “Rohit says” to browser speech so the simulated employee remains clear without looking at the screen.

**What to learn:** Completing a prototype is more than adding screens. A live demo needs clear setup instructions, known limitations, a way to observe important experience measures, and honest evidence about difficult cases.

## Next step

Test difficult conversations and document the app's limits and tradeoffs.

## Future steps

1. Test difficult cases and document the app's limits and tradeoffs.

## How to read this guide

You only need to focus on the latest completed step and the next step. When we implement another piece, we will add a new section here with its summary, changes, learning point, and commit.
