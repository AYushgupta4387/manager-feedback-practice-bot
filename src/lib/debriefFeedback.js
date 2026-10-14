import { employeeRecord } from "../data/employeeRecord.js";

function includesAny(text, patterns) {
  return patterns.some((pattern) => pattern.test(text));
}

function findTurn(turns, patterns) {
  return turns.find((turn) => includesAny(turn.text, patterns));
}

function quote(turn) {
  return turn ? `“${turn.text}”` : "“No manager statement was captured.”";
}

export function createDebrief(transcript) {
  const managerTurns = transcript.filter((turn) => turn.speaker === "manager");
  const managerText = managerTurns.map((turn) => turn.text).join(" ").toLowerCase();
  const hasSituation = /09:30|last two weeks|september|four occasions|recent/.test(managerText);
  const hasBehaviour = /late|lateness|joined|arriv/.test(managerText);
  const hasImpact = /handover|delay|team|client|cover|impact/.test(managerText);
  const hasNextStep = /what could|how can|can you|will you|agree|plan|notify|message/.test(managerText);
  const completedChecks = [hasSituation, hasBehaviour, hasImpact, hasNextStep].filter(Boolean).length;
  const impactTurn = findTurn(managerTurns, [/handover|delay|team|client|cover|impact/i]);
  const nextStepTurn = findTurn(managerTurns, [/what could|how can|can you|will you|agree|plan|notify|message/i]);
  const openingTurn = managerTurns[0];

  const readiness =
    completedChecks === 4
      ? {
          label: "Ready to use",
          tone: "ready",
          summary: "You covered the situation, behaviour, impact, and a practical next step.",
        }
      : completedChecks >= 2
        ? {
            label: "Nearly ready",
            tone: "nearly-ready",
            summary: "The conversation has a useful foundation, but one focused improvement will make it clearer.",
          }
        : {
            label: "Needs another rehearsal",
            tone: "needs-work",
            summary: "Make the feedback more specific before using it in a real conversation.",
          };

  const workedTurn = impactTurn || nextStepTurn || openingTurn;
  const worked = impactTurn
    ? {
        title: "You connected behaviour to work impact",
        quote: quote(impactTurn),
        explanation: "Naming the effect on the handover keeps the feedback about work rather than Rohit's character.",
      }
    : nextStepTurn
      ? {
          title: "You invited a practical next step",
          quote: quote(nextStepTurn),
          explanation: "A specific question gives Rohit room to help create a workable plan.",
        }
      : {
          title: "You opened the conversation directly",
          quote: quote(workedTurn),
          explanation: "The next improvement is to add concrete evidence and the effect on the team.",
        };

  const improvement = !hasImpact
    ? {
        title: "Make the impact explicit",
        quote: quote(openingTurn),
        explanation: "Add what the late arrival delayed or who had to cover, so the expectation does not sound personal.",
      }
    : !hasNextStep
      ? {
          title: "End with an agreed action",
          quote: quote(impactTurn || openingTurn),
          explanation: "Ask for a concrete plan, such as arriving before stand-up or messaging the team before a delay.",
        }
      : !hasSituation || !hasBehaviour
        ? {
            title: "Use more observable detail",
            quote: quote(openingTurn),
            explanation: "Name the 09:30 stand-up and the repeated late arrivals so the feedback is fair and easy to act on.",
          }
        : {
            title: "Confirm the follow-through",
            quote: quote(nextStepTurn || openingTurn),
            explanation: "Before ending, agree how long the new plan will be tried and when you will check in again.",
          };

  const { displayName } = employeeRecord.employee;
  const { expectedTime } = employeeRecord.observableEvents[0];
  const eventCount = employeeRecord.observableEvents.length;

  return {
    readiness,
    worked,
    improvement,
    revisedOpening: `${displayName}, over the last two weeks you joined the ${expectedTime} stand-up late on ${eventCount} occasions. When that happens, the team handover is delayed. I need you to be ready by ${expectedTime}, or message the team before the stand-up if a delay is unavoidable. What plan can you commit to for the next two weeks?`,
    pushbacks: [
      {
        employee: "The train service has been unreliable lately.",
        manager: "I hear that the journey has been difficult. The expectation still needs to be reliable, so what earlier train or backup plan could you try, and when would you message the team?",
      },
      {
        employee: "I have stayed later to make up the time.",
        manager: "I appreciate the effort to make up time. The issue is the missed handover at the start of the day, so let’s agree how you will protect that instead.",
      },
    ],
  };
}
