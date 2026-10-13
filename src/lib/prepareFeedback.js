const unsafePatterns = [
  {
    pattern: /health|sick|medical/i,
    message: "Do not make health information part of a performance conversation. Speak to your HR partner if it is relevant.",
  },
  {
    pattern: /pip|manage (him|her|them) out|remove (him|her|them)/i,
    message: "This tool supports a fair feedback conversation, not building a case to remove someone. Use the appropriate HR process instead.",
  },
  {
    pattern: /lazy|entitled/i,
    message: "Replace character labels with observable actions and their work impact.",
  },
  {
    pattern: /360|peer feedback|peers said/i,
    message: "Do not use anonymous peer feedback as evidence in this conversation.",
  },
];

export const startingDraft =
  "Rohit, over the last two weeks you joined the 09:30 stand-up late on four occasions. When that happens, the client handover is delayed for the rest of the team. I would like to understand what is getting in the way and agree how we can make this more dependable.";

export function assessDraft(draft) {
  const normalizedDraft = draft.toLowerCase();

  const checks = [
    {
      id: "situation",
      label: "Situation is specific",
      hint: "Name a time, period, or meeting—such as the 09:30 stand-up or the last two weeks.",
      complete: /09:30|last two weeks|september|four occasions/.test(normalizedDraft),
    },
    {
      id: "behaviour",
      label: "Behaviour is observable",
      hint: "Describe lateness or joining after a meeting begins, rather than judging Rohit as a person.",
      complete: /late|lateness|joined after|arriv/.test(normalizedDraft),
    },
    {
      id: "impact",
      label: "Impact is concrete",
      hint: "Explain what was delayed or who had to cover the work.",
      complete: /handover|team|client|delay|cover/.test(normalizedDraft),
    },
    {
      id: "change",
      label: "Invites a practical next step",
      hint: "Ask what is getting in the way or how the manager and employee can agree a dependable change.",
      complete: /understand|what.*getting in the way|agree|how.*can/.test(normalizedDraft),
    },
  ];

  return {
    checks,
    safetyMessages: unsafePatterns
      .filter(({ pattern }) => pattern.test(draft))
      .map(({ message }) => message),
  };
}
