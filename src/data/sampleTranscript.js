// Fixed turns let us validate the conversation UI before microphone input,
// speech playback, or an AI provider can introduce extra variables.
export const sampleTranscript = [
  {
    id: "turn-1",
    speaker: "manager",
    speakerLabel: "Manager",
    time: "09:30",
    text: "Rohit, I want to talk about the recent late arrivals to our morning stand-up.",
  },
  {
    id: "turn-2",
    speaker: "employee",
    speakerLabel: "Rohit · simulated employee",
    time: "09:30",
    text: "I know I have been late a few times, but the train service has been unreliable lately.",
  },
  {
    id: "turn-3",
    speaker: "manager",
    speakerLabel: "Manager",
    time: "09:31",
    text: "Over the last two weeks, you joined after the 09:30 stand-up on four occasions. When that happens, the handover is delayed for the rest of the team.",
  },
  {
    id: "turn-4",
    speaker: "employee",
    speakerLabel: "Rohit · simulated employee",
    time: "09:31",
    text: "I have stayed later to make up the time. I did not realise it was delaying everyone else.",
  },
  {
    id: "turn-5",
    speaker: "manager",
    speakerLabel: "Manager",
    time: "09:32",
    text: "I appreciate that you have made the time up. What could help you either arrive before stand-up or let the team know before it begins?",
  },
];
