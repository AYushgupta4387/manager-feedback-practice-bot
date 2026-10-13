import record from "./employee_record.json";

// This adapter is the only place that the UI learns the record's shape.
// If the supplied record later has different field names, translate it here.
export const employeeRecord = record;

export const employeeContext = {
  name: record.employee.displayName,
  role: record.employee.role,
  team: record.employee.team,
  scenario: record.scenario.title,
  recordStatus: record.recordStatus,
  referencePeriod: record.scenario.referencePeriod,
  availableFacts: record.observableEvents.map((event) => ({
    id: event.id,
    text: `${event.date}: arrived at ${event.arrivalTime} for the ${event.expectedTime} stand-up. ${event.workImpact}`,
  })),
  excludedTopics: record.conversationBoundaries.excludeFromConversation,
};
