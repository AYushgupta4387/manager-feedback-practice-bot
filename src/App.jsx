import { useState } from "react";
import { employeeContext } from "./data/employeeRecord.js";
import { useSpeechRecognition } from "./hooks/useSpeechRecognition.js";
import { useSpeechSynthesis } from "./hooks/useSpeechSynthesis.js";
import { assessDraft, startingDraft } from "./lib/prepareFeedback.js";
import { sampleTranscript } from "./data/sampleTranscript.js";

const steps = [
  { id: "context", label: "Context", enabled: true },
  { id: "prepare", label: "Prepare", enabled: true },
  { id: "rehearse", label: "Rehearse", enabled: true },
  { id: "debrief", label: "Debrief", enabled: false },
];

function App() {
  const [activeMode, setActiveMode] = useState("context");
  const [draft, setDraft] = useState("");
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

  const addManagerSpeechTurn = (text) => {
    const time = new Intl.DateTimeFormat("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date());

    setTranscript((currentTranscript) => [
      ...currentTranscript,
      {
        id: `manager-${Date.now()}`,
        speaker: "manager",
        speakerLabel: "Manager",
        text,
        time,
      },
    ]);
  };

  const markLatestEmployeeTurnInterrupted = () => {
    setTranscript((currentTranscript) => {
      const lastEmployeeIndex = currentTranscript
        .map((turn) => turn.speaker)
        .lastIndexOf("employee");

      if (lastEmployeeIndex === -1) return currentTranscript;

      return currentTranscript.map((turn, index) =>
        index === lastEmployeeIndex ? { ...turn, interrupted: true } : turn,
      );
    });
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

      {activeMode === "context" && (
        <ContextScreen onOpenPrepare={() => setActiveMode("prepare")} />
      )}
      {activeMode === "prepare" && (
        <PrepareScreen
          draft={draft}
          onChangeDraft={setDraft}
          onContinueToRehearsal={openRehearsal}
          onLoadStartingDraft={() => setDraft(startingDraft)}
        />
      )}
      {activeMode === "rehearse" && (
        <RehearsalScreen
          canAddSampleTurn={canAddSampleTurn}
          onAddSampleTurn={addSampleTurn}
          onBackToContext={() => setActiveMode("context")}
          onInterruptEmployee={markLatestEmployeeTurnInterrupted}
          onManagerSpeechComplete={addManagerSpeechTurn}
          onResetTranscript={resetTranscript}
          transcript={transcript}
        />
      )}
    </main>
  );
}

function ContextScreen({ onOpenPrepare }) {
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
        <button onClick={onOpenPrepare} type="button">Prepare your opening</button>
      </section>
    </>
  );
}

function PrepareScreen({
  draft,
  onChangeDraft,
  onContinueToRehearsal,
  onLoadStartingDraft,
}) {
  const { checks, safetyMessages } = assessDraft(draft);
  const completedChecks = checks.filter((check) => check.complete).length;

  return (
    <section className="prepare-screen" aria-labelledby="prepare-title">
      <div className="prepare-heading">
        <div>
          <p className="eyebrow">Step 2 of 4 · Prepare</p>
          <h2 id="prepare-title">Build an opening that is clear and fair.</h2>
          <p>
            Use Situation–Behaviour–Impact to describe what happened without
            turning a work issue into a judgment about Rohit.
          </p>
        </div>
        <span className="prepare-progress" aria-live="polite">
          {completedChecks} of 4 SBI elements present
        </span>
      </div>

      <div className="prepare-layout">
        <section className="draft-panel" aria-labelledby="draft-title">
          <div className="draft-panel-header">
            <div>
              <p className="eyebrow">Your opening</p>
              <h3 id="draft-title">Write it as you would say it.</h3>
            </div>
            <button className="button--secondary" onClick={onLoadStartingDraft} type="button">
              Load a starting draft
            </button>
          </div>

          <label className="visually-hidden" htmlFor="opening-draft">
            Opening feedback statement
          </label>
          <textarea
            id="opening-draft"
            onChange={(event) => onChangeDraft(event.target.value)}
            placeholder="For example: Over the last two weeks, you joined the 09:30 stand-up late on four occasions..."
            value={draft}
          />
          <p className="draft-helper">
            This is local prototype guidance, not an assessment score. The goal
            is a practical opening you can say out loud.
          </p>
        </section>

        <aside className="sbi-panel" aria-labelledby="sbi-title">
          <p className="eyebrow">SBI check</p>
          <h3 id="sbi-title">Does the opening contain the essentials?</h3>
          <ul className="sbi-checklist">
            {checks.map((check) => (
              <li className={check.complete ? "check--complete" : ""} key={check.id}>
                <span aria-hidden="true">{check.complete ? "✓" : "○"}</span>
                <div>
                  <strong>{check.label}</strong>
                  <p>{check.hint}</p>
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      {safetyMessages.length > 0 && (
        <aside className="safety-guidance" aria-live="polite" aria-label="Safety guidance">
          <p className="notice-icon" aria-hidden="true">!</p>
          <div>
            <h3>Use a different route for this request</h3>
            <ul>
              {safetyMessages.map((message) => <li key={message}>{message}</li>)}
            </ul>
          </div>
        </aside>
      )}

      <section className="prepare-next-step" aria-labelledby="prepare-next-title">
        <div>
          <p className="eyebrow">When the opening is ready</p>
          <h3 id="prepare-next-title">Practise saying it in the rehearsal.</h3>
          <p>
            In the next technical slice, your final draft will become the first
            spoken manager turn rather than a fixed sample sentence.
          </p>
        </div>
        <button onClick={onContinueToRehearsal} type="button">
          Continue to rehearsal demo
        </button>
      </section>
    </section>
  );
}

function RehearsalScreen({
  canAddSampleTurn,
  onAddSampleTurn,
  onBackToContext,
  onInterruptEmployee,
  onManagerSpeechComplete,
  onResetTranscript,
  transcript,
}) {
  const { error, isSupported, speak, status, stop } = useSpeechSynthesis();
  const {
    error: recognitionError,
    finalText,
    finish,
    interimText,
    isSupported: isRecognitionSupported,
    start,
    status: recognitionStatus,
  } = useSpeechRecognition({ onComplete: onManagerSpeechComplete });
  const latestEmployeeTurn = [...transcript]
    .reverse()
    .find((turn) => turn.speaker === "employee");
  const isSpeaking = status === "speaking";
  const isListening = recognitionStatus === "listening";
  const isStarting = recognitionStatus === "starting";
  const isFinishing = recognitionStatus === "finishing";
  const recognitionPreview = [finalText, interimText].filter(Boolean).join(" ");

  const interruptAndSpeak = () => {
    stop();
    onInterruptEmployee();
    start();
  };

  return (
    <section className="rehearsal-screen" aria-labelledby="rehearsal-title">
      <div className="rehearsal-heading">
        <div>
          <p className="eyebrow">Browser voice rehearsal prototype</p>
          <h2 id="rehearsal-title">Practise with {employeeContext.name}.</h2>
          <p>
            These are fixed sample replies. Use your voice for the manager,
            hear Rohit's reply, and practise taking the floor when needed.
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
                  <span className="turn-speaker">
                    <strong>{turn.speakerLabel}</strong>
                    {turn.interrupted && <span className="interruption-label">Interrupted</span>}
                  </span>
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

      <section className="speech-panel" aria-labelledby="speech-title">
        <div>
          <p className="eyebrow">Rohit's voice</p>
          <h3 id="speech-title">Play the latest employee reply.</h3>
          <p className="speech-status" aria-live="polite">
            {error ||
              (isSpeaking
                ? "Rohit is speaking — simulated employee."
                : isSupported
                  ? "Ready to play a simulated employee reply."
                  : "Text-to-speech is unavailable in this browser.")}
          </p>
        </div>
        <div className="speech-actions">
          <button
            disabled={
              isSpeaking
                ? !isRecognitionSupported
                : !latestEmployeeTurn || !isSupported
            }
            onClick={() =>
              isSpeaking
                ? interruptAndSpeak()
                : speak(latestEmployeeTurn.text)
            }
            type="button"
          >
            {isSpeaking ? "Interrupt and speak" : "Play Rohit's latest reply"}
          </button>
          <button
            className="button--secondary"
            disabled={!isSpeaking}
            onClick={stop}
            type="button"
          >
            Stop Rohit
          </button>
        </div>
      </section>

      <section className="voice-input-panel" aria-labelledby="voice-input-title">
        <div>
          <p className="eyebrow">Your voice</p>
          <h3 id="voice-input-title">Speak as the manager.</h3>
          <p className="voice-input-status" aria-live="polite">
            {recognitionError ||
              (isSpeaking
                ? "Rohit is speaking. Choose Interrupt and speak to take the floor."
                : isListening
                  ? "Listening. Take your time, then choose Finish turn."
                : isStarting
                  ? "Opening the microphone…"
                : isFinishing
                  ? "Finishing your turn…"
                  : isRecognitionSupported
                    ? "Start speaking when you are ready."
                    : "Speech recognition is unavailable in this browser.")}
          </p>
        </div>
        <div className="voice-input-actions">
          <button
            disabled={
              !isRecognitionSupported ||
              isSpeaking ||
              isListening ||
              isStarting ||
              isFinishing
            }
            onClick={start}
            type="button"
          >
            Start speaking
          </button>
          <button
            className="button--secondary"
            disabled={!isListening}
            onClick={finish}
            type="button"
          >
            Finish turn
          </button>
        </div>
        <div className="voice-preview" aria-live="polite">
          <strong>Live transcript</strong>
          <p>{recognitionPreview || "Your words will appear here while you speak."}</p>
        </div>
        <p className="voice-input-note">
          Your turn is added only after you choose Finish turn. This prototype
          keeps the transcript in the browser and does not send it to an AI.
        </p>
      </section>

      <aside className="learning-note" aria-label="Why this comes before voice">
        <p className="notice-icon" aria-hidden="true">i</p>
        <p>
          <strong>Why this is a separate step:</strong> Manual finish gives
          the manager control over when their turn ends. Interrupting Rohit
          stops audio before opening the microphone, so the employee's voice is
          not captured as the manager's turn.
        </p>
      </aside>
    </section>
  );
}

export default App;
