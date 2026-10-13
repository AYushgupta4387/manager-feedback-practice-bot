// This is deliberately not an invented employee record. The brief references a
// separate employee_record.json file, but that file has not been supplied yet.
// Keeping the missing data explicit is safer than presenting assumptions as facts.
export const employeeContext = {
  name: 'Rohit',
  scenario: 'Repeated lateness',
  recordStatus: 'awaiting-source-data',
  availableFacts: [
    'The rehearsal is about repeated lateness.',
    'Use observable behaviour and its work impact in the conversation.',
    'Agree a change and how it will be checked after listening.',
  ],
  excludedTopics: [
    'Health or sickness information',
    'Anonymous 360 feedback',
    'A plan to create a PIP or manage someone out',
    'Character labels such as “lazy” or “entitled”',
  ],
};
