# Manager Feedback Coach

A local browser prototype for practising one difficult feedback conversation: repeated lateness to a daily stand-up. All employee information is synthetic.

## Run it locally

1. Install Node.js 20 or later and pnpm.
2. In this folder, run `pnpm install`.
3. Optional: copy `.env.example` to `.env` and add `GEMINI_API_KEY=<your key>`.
4. Run `pnpm dev` and open the browser address printed by Vite (normally `http://localhost:5173`).

Without a Gemini key, the rehearsal still works with a built-in deterministic employee response. With a key, the server tries the configured `GEMINI_MODELS` in order and falls back to the local response if every model is rate-limited.

## Demo path

1. Read **Context** to see the observable evidence and excluded topics.
2. Use **Prepare** to draft an SBI opening.
3. In **Rehearse**, use Microsoft Edge or Chrome, allow microphone access, then select **Start speaking** and **Finish turn**.
4. Rohit replies in browser speech. Select **Interrupt and speak** to take the floor.
5. Select **Debrief this conversation** for practical coaching based on the visible transcript.

## Technical choices and limits

- Speech recognition uses the browser `SpeechRecognition` API, which is most reliable in Edge/Chrome and may be unavailable elsewhere.
- Rohit's voice uses browser `speechSynthesis`; each response starts with “Rohit says” so the simulated employee is distinct in audio.
- The Rehearse screen reports the latest measured time from finishing a manager turn to browser speech starting. This is a local measurement, not a latency guarantee.
- The prototype stores no data and has no authentication, database, deployment, or real employee records.

See [WRITEUP.md](WRITEUP.md) for decisions and limitations, and [PROBE_RESULTS.md](PROBE_RESULTS.md) for the required probe-input results.
