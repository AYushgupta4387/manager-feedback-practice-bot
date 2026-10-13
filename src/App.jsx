import { employeeContext } from './data/employeeContext.js';

const steps = ['Context', 'Prepare', 'Rehearse', 'Debrief'];

function App() {
  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Manager feedback coach</p>
          <h1>Practise the conversation before it matters.</h1>
        </div>
        <p className="simulation-badge" role="note">
          <span aria-hidden="true">●</span> Simulation — not a prediction of a real employee
        </p>
      </header>

      <nav aria-label="Practice stages" className="stage-nav">
        {steps.map((step, index) => (
          <div className={`stage ${index === 0 ? 'stage--active' : ''}`} key={step}>
            <span className="stage-number">{index + 1}</span>
            <span>{step}</span>
          </div>
        ))}
      </nav>

      <section className="context-layout" aria-labelledby="context-title">
        <div className="context-intro">
          <p className="eyebrow">Step 1 of 4</p>
          <h2 id="context-title">Start with the relevant context.</h2>
          <p>
            A difficult feedback conversation should be based on specific, observable work
            behaviour—not assumptions about a person. This screen makes that boundary visible
            before the rehearsal begins.
          </p>

          <article className="employee-card">
            <div className="avatar" aria-hidden="true">R</div>
            <div>
              <p className="card-label">Employee in this simulation</p>
              <h3>{employeeContext.name}</h3>
              <p>{employeeContext.scenario}</p>
            </div>
          </article>
        </div>

        <aside className="record-notice" aria-labelledby="record-title">
          <p className="notice-icon" aria-hidden="true">i</p>
          <div>
            <h3 id="record-title">Employee record needed</h3>
            <p>
              The brief refers to a synthetic <code>employee_record.json</code>, but that file
              has not been supplied with the brief. This screen is wired around a clearly marked
              placeholder rather than inventing facts about Rohit.
            </p>
          </div>
        </aside>
      </section>

      <section className="decision-grid" aria-label="Conversation boundaries">
        <article className="decision-card decision-card--use">
          <p className="card-kicker">Use in the conversation</p>
          <h2>Facts we can practise with</h2>
          <ul>
            {employeeContext.availableFacts.map((fact) => <li key={fact}>{fact}</li>)}
          </ul>
        </article>

        <article className="decision-card decision-card--avoid">
          <p className="card-kicker">Keep out of the conversation</p>
          <h2>Topics that need a different route</h2>
          <ul>
            {employeeContext.excludedTopics.map((topic) => <li key={topic}>{topic}</li>)}
          </ul>
        </article>
      </section>

      <section className="next-step" aria-labelledby="next-step-title">
        <div>
          <p className="eyebrow">Next learning slice</p>
          <h2 id="next-step-title">Build the transcript state before adding voice.</h2>
          <p>
            We will next add a visible conversation transcript with sample turns. Voice and AI
            come after the core conversation flow is easy to see and test.
          </p>
        </div>
        <button type="button" disabled aria-describedby="record-required">
          Continue to Prepare
        </button>
        <p id="record-required" className="visually-hidden">
          Continuing is disabled until an employee record is supplied.
        </p>
      </section>
    </main>
  );
}

export default App;
