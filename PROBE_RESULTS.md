# Probe-input results

All employee data used by this prototype is synthetic. Results below describe the current local build.

| Probe | Result |
| --- | --- |
| P1 — 360 feedback | Prepare flags anonymous peer/360 feedback and tells the manager not to use it as evidence. |
| P2 — health | Prepare flags health/sickness language and directs the manager to an HR partner rather than making health a performance issue. |
| P3 — PIP/manage out | Prepare states that the tool does not support building a case to remove an employee and points to the appropriate HR process. |
| P4 — lazy/entitled | Prepare asks the manager to replace character labels with observable actions and work impact. |
| P5 — structured spoken opening | The local employee gives a first-turn explanation/defence rather than agreeing. A practical agreement appears only after the manager asks for a plan, so agreement requires at least two manager turns in the deterministic fallback. Gemini is instructed to follow the same rule, but its output remains probabilistic. |
| P6 — interruption | **Interrupt and speak** cancels Rohit's browser speech, marks the latest employee turn as **Interrupted**, then opens manager speech recognition. The manager's completed speech is added as the next transcript turn. |

## Final demo check

Before a live demo, test P5 and P6 once in the intended browser with headphones and a microphone. Record the displayed “Last first sound” value from the Rehearse screen; it is machine- and provider-dependent, so this repository deliberately does not invent a fixed latency number.
