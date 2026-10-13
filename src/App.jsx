import { useState } from "react";
import { employeeContext } from "./data/employeeRecord.js";
import { sampleTranscript } from "./data/sampleTranscript.js";

const steps = [
  { id: "context", label: "Context", enabled: true },
  { id: "prepare", label: "Prepare", enabled: false },
  { id: "rehearse", label: "Rehearse", enabled: true },
  { id: "debrief", label: "Debrief", enabled: false },
];

function App() {
  const [activeMode, setActiveMode] = useState("context");
  const [transcript, setTranscript] = useState([]);
  const [nextTurnIndex, setNextTurnIndex] = useState(0);

  const openRehearsal = () => {
    if (transcript.length === 0) {
      setTranscript(sampleTranscript.slice(0, 2));
      setNextTurnIndex(2);
    }

    setActiveMode("rehearse");
  };

  const addSampleTurn = () => {
    const nextTurn = sampleTranscript[nextTurnIndex];

    if (!nextTurn) return;

    setTranscript((currentTranscript) => [...currentTranscript, nextTurn]);
    setNextTurnIndex((currentIndex) => currentIndex + 1);
  };

  const resetTranscript = () => {
    setTranscript([]);
    setNextTurnIndex(0);
  };

  const canAddSampleTurn = nextTurnIndex < sampleTranscript.length;

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Manager feedback coach</p>
          <h1>Practise the conversation before it matters.</h1>
        </div>
        <p className="simulation-badge" role="note">
          <span aria-hidden="true">●</span> Simulation — not a prediction of a
          real employee
        </p>
      </header>

      <nav aria-label="Practice stages" className="stage-nav">
        {steps.map((step, index) => (
          <button
            className={`stage ${activeMode === step.id ? "stage--active" : ""}`}
            disabled={!step.enabled}
            key={step.id}
            onClick={() =>
              step.id === "rehearse" ? openRehearsal() : setActiveMode(step.id)
            }
            type="button"
          >
            <span className="stage-number">{index + 1}</span>
            <span>{step.label}</span>
          </button>
        ))}
      </nav>

      {activeMode === "context" ? (
        <ContextScreen onOpenRehearsal={openRehearsal} />
      ) : (
        <RehearsalScreen
          canAddSampleTurn={canAddSampleTurn}
          onAddSampleTurn={addSampleTurn}
          onBackToContext={() => setActiveMode("context")}
          onResetTranscript={resetTranscript}
          transcript={transcript}
        />
      )}
    </main>
  );
}

function ContextScreen({ onOpenRehearsal }) {
  return (
    <>
      <section className="context-layout" aria-labelledby="context-title">
        <div className="context-intro">
          <p className="eyebrow">Step 1 of 4</p>
          <h2 id="context-title">Start with the relevant context.</h2>
          <p>
            A difficult feedback conversation should be based on specific,
            observable work behaviour—not assumptions about a person. This
            screen makes that boundary visible before the rehearsal begins.
          </p>

          <article className="employee-card">
            <div className="avatar" aria-hidden="true">R</div>
            <div>
              <p className="card-label">Employee in this simulation</p>
              <h3>{employeeContext.name}</h3>
              <p>{employeeContext.role} · {employeeContext.team}</p>
            </div>
          </article>
        </div>

        <aside className="record-notice record-notice--mock" aria-labelledby="record-title">
          <p className="notice-icon" aria-hidden="true">✓</p>
          <div>
            <h3 id="record-title">Synthetic practice record</h3>
            <p>
              This is a detailed mock <code>employee_record.json</code> for the
              prototype. It is clearly marked as mock data and can be replaced
              later through one adapter file.
            </p>
          </div>
        </aside>
      </section>

      <section className="decision-grid" aria-label="Conversation boundaries">
        <article className="decision-card decision-card--use">
          <p className="card-kicker">Use in the conversation</p>
          <h2>Observable evidence to practise with</h2>
          <p className="evidence-period">{employeeContext.referencePeriod}</p>
          <ul>
            {employeeContext.availableFacts.map((fact) => (
              <li key={fact.id}>{fact.text}</li>
            ))}
          </ul>
        </article>

        <article className="decision-card decision-card--avoid">
          <p className="card-kicker">Keep out of the conversation</p>
          <h2>Topics that need a different route</h2>
          <ul>
            {employeeContext.excludedTopics.map((topic) => (
              <li key={topic}>{topic}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="next-step" aria-labelledby="next-step-title">
        <div>
          <p className="eyebrow">Next learning slice</p>
          <h2 id="next-step-title">Explore the transcript state.</h2>
          <p>
            This text-only rehearsal uses fixed sample turns. Later, speech
            recognition will create manager turns and AI will create Rohit's
            replies using this same transcript structure.
          </p>
        </div>
        <button onClick={onOpenRehearsal} type="button">Open transcript demo</button>
      </section>
    </>
  );
}

function RehearsalScreen({
  canAddSampleTurn,
  onAddSampleTurn,
  onBackToContext,
  onResetTranscript,
  transcript,
}) {
  return (
    <section className="rehearsal-screen" aria-labelledby="rehearsal-title">
      <div className="rehearsal-heading">
        <div>
          <p className="eyebrow">Text-only rehearsal prototype</p>
          <h2 id="rehearsal-title">Practise with {employeeContext.name}.</h2>
          <p>
            These are fixed sample turns. They let us prove the conversation
            state before microphone input, audio playback, or AI is involved.
          </p>
        </div>
        <button className="button--secondary" onClick={onBackToContext} type="button">
          Back to context
        </button>
      </div>

      <section className="transcript-panel" aria-labelledby="transcript-title">
        <header className="transcript-header">
          <div>
            <p className="eyebrow">Conversation</p>
            <h3 id="transcript-title">Visible transcript</h3>
          </div>
          <span className="turn-count" aria-live="polite">
            {transcript.length} {transcript.length === 1 ? "turn" : "turns"}
          </span>
        </header>

        {transcript.length === 0 ? (
          <div className="transcript-empty">
            <p>No turns yet. Open the transcript demo again to add the opening turns.</p>
          </div>
        ) : (
          <ol className="transcript-list">
            {transcript.map((turn) => (
              <li className={`transcript-turn transcript-turn--${turn.speaker}`} key={turn.id}>
                <div className="turn-meta">
                  <strong>{turn.speakerLabel}</strong>
                  <time>{turn.time}</time>
                </div>
                <p>{turn.text}</p>
              </li>
            ))}
          </ol>
        )}

        <footer className="transcript-actions">
          <button disabled={!canAddSampleTurn} onClick={onAddSampleTurn} type="button">
            {canAddSampleTurn ? "Add next sample turn" : "All sample turns shown"}
          </button>
          <button className="button--secondary" onClick={onResetTranscript} type="button">
            Reset transcript
          </button>
        </footer>
      </section>

      <aside className="learning-note" aria-label="Why this comes before voice">
        <p className="notice-icon" aria-hidden="true">i</p>
        <p>
          <strong>Why build this first?</strong> Voice and AI will both add
          turns to this list. Getting the transcript model right first keeps
          those later features small and testable.
        </p>
      </aside>
    </section>
  );
}

export default App;
