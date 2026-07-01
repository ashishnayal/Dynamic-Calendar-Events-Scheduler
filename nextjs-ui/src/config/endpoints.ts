export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface ParamDef {
  name: string;
  type: 'path' | 'query';
  description?: string;
}

export interface EndpointDef {
  id: string;
  group: string;
  name: string;
  method: HttpMethod;
  path: string;
  description: string;
  params: ParamDef[];
  hasBody: boolean;
  defaultBody?: string;
}

export const endpoints: EndpointDef[] = [
  // Status
  {
    id: 'status-get',
    group: 'Status',
    name: 'Get Status',
    method: 'GET',
    path: '/api/v1/status',
    description: 'Health check endpoint to verify backend is up.',
    params: [],
    hasBody: false,
  },
  
  // Accounts
  {
    id: 'account-create',
    group: 'Accounts',
    name: 'Create Account',
    method: 'POST',
    path: '/api/v1/accounts',
    description: 'Create a new account.',
    params: [],
    hasBody: true,
    defaultBody: '{\n  "settings": {\n    "webhook": {\n      "url": "https://webhook.site/test",\n      "key": "secret123"\n    }\n  }\n}'
  },
  {
    id: 'account-get-all',
    group: 'Accounts',
    name: 'Get All Accounts',
    method: 'GET',
    path: '/api/v1/accounts',
    description: 'Retrieve a list of all accounts.',
    params: [],
    hasBody: false,
  },
  {
    id: 'account-get',
    group: 'Accounts',
    name: 'Get Account',
    method: 'GET',
    path: '/api/v1/accounts/{id}',
    description: 'Retrieve a specific account by ID.',
    params: [{ name: 'id', type: 'path', description: 'Account ID' }],
    hasBody: false,
  },
  {
    id: 'account-update',
    group: 'Accounts',
    name: 'Update Account',
    method: 'PUT',
    path: '/api/v1/accounts/{id}',
    description: 'Update account settings.',
    params: [{ name: 'id', type: 'path', description: 'Account ID' }],
    hasBody: true,
    defaultBody: '{\n  "settings": {\n    "webhook": {\n      "url": "https://webhook.site/updated",\n      "key": "newsecret"\n    }\n  }\n}'
  },
  {
    id: 'account-delete',
    group: 'Accounts',
    name: 'Delete Account',
    method: 'DELETE',
    path: '/api/v1/accounts/{id}',
    description: 'Delete an account.',
    params: [{ name: 'id', type: 'path', description: 'Account ID' }],
    hasBody: false,
  },

  // Users
  {
    id: 'user-create',
    group: 'Users',
    name: 'Create User',
    method: 'POST',
    path: '/api/v1/users',
    description: 'Create a new user within an account.',
    params: [],
    hasBody: true,
    defaultBody: '{\n  "accountId": "REPLACE_WITH_ACCOUNT_ID",\n  "metadata": {\n    "name": "John Doe",\n    "role": "admin"\n  }\n}'
  },
  {
    id: 'user-get',
    group: 'Users',
    name: 'Get User',
    method: 'GET',
    path: '/api/v1/users/{id}',
    description: 'Retrieve a user by ID.',
    params: [{ name: 'id', type: 'path', description: 'User ID' }],
    hasBody: false,
  },
  {
    id: 'user-get-by-account',
    group: 'Users',
    name: 'Get Users by Account',
    method: 'GET',
    path: '/api/v1/users/account/{accountId}',
    description: 'Get all users for a given account.',
    params: [{ name: 'accountId', type: 'path', description: 'Account ID' }],
    hasBody: false,
  },
  {
    id: 'user-get-meta',
    group: 'Users',
    name: 'Get Users by Metadata',
    method: 'GET',
    path: '/api/v1/users/meta',
    description: 'Query users by metadata key-value pair.',
    params: [
      { name: 'key', type: 'query', description: 'Metadata key' },
      { name: 'value', type: 'query', description: 'Metadata value' }
    ],
    hasBody: false,
  },
  {
    id: 'user-get-freebusy',
    group: 'Users',
    name: 'Get User Free/Busy',
    method: 'GET',
    path: '/api/v1/users/{id}/freebusy',
    description: 'Get a user\'s free/busy schedule within a timespan.',
    params: [
      { name: 'id', type: 'path', description: 'User ID' },
      { name: 'startTs', type: 'query', description: 'Start timestamp (ms)' },
      { name: 'endTs', type: 'query', description: 'End timestamp (ms)' }
    ],
    hasBody: false,
  },
  {
    id: 'user-update',
    group: 'Users',
    name: 'Update User',
    method: 'PUT',
    path: '/api/v1/users/{id}',
    description: 'Update user metadata.',
    params: [{ name: 'id', type: 'path', description: 'User ID' }],
    hasBody: true,
    defaultBody: '{\n  "metadata": {\n    "name": "John Doe Updated"\n  }\n}'
  },
  {
    id: 'user-delete',
    group: 'Users',
    name: 'Delete User',
    method: 'DELETE',
    path: '/api/v1/users/{id}',
    description: 'Delete a user.',
    params: [{ name: 'id', type: 'path', description: 'User ID' }],
    hasBody: false,
  },

  // Calendars
  {
    id: 'calendar-create',
    group: 'Calendars',
    name: 'Create Calendar',
    method: 'POST',
    path: '/api/v1/calendars',
    description: 'Create a new calendar for a user.',
    params: [],
    hasBody: true,
    defaultBody: '{\n  "userId": "REPLACE_WITH_USER_ID",\n  "accountId": "REPLACE_WITH_ACCOUNT_ID",\n  "settings": {\n    "weekStart": "Mon",\n    "timezone": "UTC"\n  },\n  "metadata": {\n    "type": "work"\n  }\n}'
  },
  {
    id: 'calendar-get',
    group: 'Calendars',
    name: 'Get Calendar',
    method: 'GET',
    path: '/api/v1/calendars/{id}',
    description: 'Get a calendar by ID.',
    params: [{ name: 'id', type: 'path', description: 'Calendar ID' }],
    hasBody: false,
  },
  {
    id: 'calendar-get-by-user',
    group: 'Calendars',
    name: 'Get Calendars by User',
    method: 'GET',
    path: '/api/v1/calendars/user/{userId}',
    description: 'Get all calendars owned by a user.',
    params: [{ name: 'userId', type: 'path', description: 'User ID' }],
    hasBody: false,
  },
  {
    id: 'calendar-get-meta',
    group: 'Calendars',
    name: 'Get Calendars by Metadata',
    method: 'GET',
    path: '/api/v1/calendars/meta',
    description: 'Find calendars using metadata.',
    params: [
      { name: 'key', type: 'query', description: 'Metadata key' },
      { name: 'value', type: 'query', description: 'Metadata value' }
    ],
    hasBody: false,
  },
  {
    id: 'calendar-get-events',
    group: 'Calendars',
    name: 'Get Calendar Events',
    method: 'GET',
    path: '/api/v1/calendars/{id}/events',
    description: 'Get all events attached to a specific calendar.',
    params: [{ name: 'id', type: 'path', description: 'Calendar ID' }],
    hasBody: false,
  },
  {
    id: 'calendar-update',
    group: 'Calendars',
    name: 'Update Calendar',
    method: 'PUT',
    path: '/api/v1/calendars/{id}',
    description: 'Update a calendar settings/metadata.',
    params: [{ name: 'id', type: 'path', description: 'Calendar ID' }],
    hasBody: true,
    defaultBody: '{\n  "settings": {\n    "weekStart": "Sun",\n    "timezone": "America/New_York"\n  },\n  "metadata": {\n    "type": "personal"\n  }\n}'
  },
  {
    id: 'calendar-delete',
    group: 'Calendars',
    name: 'Delete Calendar',
    method: 'DELETE',
    path: '/api/v1/calendars/{id}',
    description: 'Delete a calendar.',
    params: [{ name: 'id', type: 'path', description: 'Calendar ID' }],
    hasBody: false,
  },

  // Events
  {
    id: 'event-create',
    group: 'Events',
    name: 'Create Event',
    method: 'POST',
    path: '/api/v1/events',
    description: 'Create a new calendar event.',
    params: [],
    hasBody: true,
    defaultBody: '{\n  "startTs": 1700000000000,\n  "duration": 3600000,\n  "busy": true,\n  "endTs": 1700003600000,\n  "calendarId": "REPLACE_WITH_CALENDAR_ID",\n  "userId": "REPLACE_WITH_USER_ID",\n  "accountId": "REPLACE_WITH_ACCOUNT_ID",\n  "exdates": [],\n  "reminders": []\n}'
  },
  {
    id: 'event-get',
    group: 'Events',
    name: 'Get Event',
    method: 'GET',
    path: '/api/v1/events/{id}',
    description: 'Get a specific event by ID.',
    params: [{ name: 'id', type: 'path', description: 'Event ID' }],
    hasBody: false,
  },
  {
    id: 'event-get-by-calendar',
    group: 'Events',
    name: 'Get Events by Calendar',
    method: 'GET',
    path: '/api/v1/events/calendar/{calendarId}',
    description: 'Get all events attached to a specific calendar.',
    params: [{ name: 'calendarId', type: 'path', description: 'Calendar ID' }],
    hasBody: false,
  },
  {
    id: 'event-get-meta',
    group: 'Events',
    name: 'Get Events by Metadata',
    method: 'GET',
    path: '/api/v1/events/meta',
    description: 'Find events using metadata.',
    params: [
      { name: 'key', type: 'query', description: 'Metadata key' },
      { name: 'value', type: 'query', description: 'Metadata value' }
    ],
    hasBody: false,
  },
  {
    id: 'event-get-instances',
    group: 'Events',
    name: 'Get Event Instances',
    method: 'GET',
    path: '/api/v1/events/{id}/instances',
    description: 'Expand event recurrence instances within a timespan.',
    params: [
      { name: 'id', type: 'path', description: 'Event ID' },
      { name: 'startTs', type: 'query', description: 'Start timestamp (ms)' },
      { name: 'endTs', type: 'query', description: 'End timestamp (ms)' }
    ],
    hasBody: false,
  },
  {
    id: 'event-update',
    group: 'Events',
    name: 'Update Event',
    method: 'PUT',
    path: '/api/v1/events/{id}',
    description: 'Update event metadata.',
    params: [{ name: 'id', type: 'path', description: 'Event ID' }],
    hasBody: true,
    defaultBody: '{\n  "startTs": 1700000000000,\n  "duration": 3600000,\n  "busy": true,\n  "endTs": 1700003600000,\n  "exdates": [],\n  "reminders": []\n}'
  },
  {
    id: 'event-delete',
    group: 'Events',
    name: 'Delete Event',
    method: 'DELETE',
    path: '/api/v1/events/{id}',
    description: 'Delete an event.',
    params: [{ name: 'id', type: 'path', description: 'Event ID' }],
    hasBody: false,
  },

  // Services
  {
    id: 'service-create',
    group: 'Services',
    name: 'Create Service',
    method: 'POST',
    path: '/api/v1/services',
    description: 'Create a new bookable service.',
    params: [],
    hasBody: true,
    defaultBody: '{\n  "accountId": "REPLACE_WITH_ACCOUNT_ID",\n  "multiPerson": {\n    "variant": "RoundRobinAlgorithm",\n    "data": null\n  },\n  "metadata": {\n    "name": "15 Min Meeting"\n  }\n}'
  },
  {
    id: 'service-get',
    group: 'Services',
    name: 'Get Service',
    method: 'GET',
    path: '/api/v1/services/{id}',
    description: 'Get a service by ID.',
    params: [{ name: 'id', type: 'path', description: 'Service ID' }],
    hasBody: false,
  },
  {
    id: 'service-get-by-account',
    group: 'Services',
    name: 'Get Services by Account',
    method: 'GET',
    path: '/api/v1/services/account/{accountId}',
    description: 'Get all services for a given account.',
    params: [{ name: 'accountId', type: 'path', description: 'Account ID' }],
    hasBody: false,
  },
  {
    id: 'service-get-meta',
    group: 'Services',
    name: 'Get Services by Metadata',
    method: 'GET',
    path: '/api/v1/services/meta',
    description: 'Find services using metadata.',
    params: [
      { name: 'key', type: 'query', description: 'Metadata key' },
      { name: 'value', type: 'query', description: 'Metadata value' }
    ],
    hasBody: false,
  },
  {
    id: 'service-update',
    group: 'Services',
    name: 'Update Service',
    method: 'PUT',
    path: '/api/v1/services/{id}',
    description: 'Update service details.',
    params: [{ name: 'id', type: 'path', description: 'Service ID' }],
    hasBody: true,
    defaultBody: '{\n  "multiPerson": {\n    "variant": "RoundRobinAlgorithm",\n    "data": null\n  },\n  "metadata": {\n    "name": "Updated Meeting"\n  }\n}'
  },
  {
    id: 'service-add-user',
    group: 'Services',
    name: 'Add User to Service',
    method: 'POST',
    path: '/api/v1/services/{id}/users',
    description: 'Register a user to provide this service.',
    params: [{ name: 'id', type: 'path', description: 'Service ID' }],
    hasBody: true,
    defaultBody: '{\n  "userId": "REPLACE_WITH_USER_ID",\n  "serviceId": "REPLACE_WITH_SERVICE_ID",\n  "availability": {\n    "variant": "Calendar",\n    "id": "REPLACE_WITH_CALENDAR_ID"\n  },\n  "bufferAfter": 5,\n  "bufferBefore": 5,\n  "closestBookingTime": 60\n}'
  },
  {
    id: 'service-remove-user',
    group: 'Services',
    name: 'Remove User from Service',
    method: 'DELETE',
    path: '/api/v1/services/{id}/users/{userId}',
    description: 'Remove a user from providing this service.',
    params: [
      { name: 'id', type: 'path', description: 'Service ID' },
      { name: 'userId', type: 'path', description: 'User ID' }
    ],
    hasBody: false,
  },
  {
    id: 'service-update-user',
    group: 'Services',
    name: 'Update Service User',
    method: 'PUT',
    path: '/api/v1/services/{id}/users/{userId}',
    description: 'Update user settings in this service.',
    params: [
      { name: 'id', type: 'path', description: 'Service ID' },
      { name: 'userId', type: 'path', description: 'User ID' }
    ],
    hasBody: true,
    defaultBody: '{\n  "availability": {\n    "variant": "Calendar",\n    "id": "REPLACE_WITH_CALENDAR_ID"\n  },\n  "bufferAfter": 10,\n  "bufferBefore": 10,\n  "closestBookingTime": 120\n}'
  },
  {
    id: 'service-get-booking',
    group: 'Services',
    name: 'Get Booking Slots',
    method: 'GET',
    path: '/api/v1/services/{id}/booking',
    description: 'Find available booking slots for a service.',
    params: [
      { name: 'id', type: 'path', description: 'Service ID' },
      { name: 'startTs', type: 'query', description: 'Start timestamp' },
      { name: 'endTs', type: 'query', description: 'End timestamp' }
    ],
    hasBody: false,
  },
  {
    id: 'service-create-intend',
    group: 'Services',
    name: 'Create Booking Intend',
    method: 'POST',
    path: '/api/v1/services/{id}/booking-intend',
    description: 'Reserve a booking slot temporarily.',
    params: [{ name: 'id', type: 'path', description: 'Service ID' }],
    hasBody: true,
    defaultBody: '{\n  "accountId": "REPLACE_WITH_ACCOUNT_ID",\n  "userId": "REPLACE_WITH_USER_ID",\n  "startTs": 1700000000000,\n  "endTs": 1700003600000\n}'
  },
  {
    id: 'service-remove-intend',
    group: 'Services',
    name: 'Remove Booking Intend',
    method: 'DELETE',
    path: '/api/v1/services/{id}/booking-intend/{intendId}',
    description: 'Delete a booking intend.',
    params: [
      { name: 'id', type: 'path', description: 'Service ID' },
      { name: 'intendId', type: 'path', description: 'Booking Intend ID' }
    ],
    hasBody: false,
  },
  {
    id: 'service-delete',
    group: 'Services',
    name: 'Delete Service',
    method: 'DELETE',
    path: '/api/v1/services/{id}',
    description: 'Delete a service.',
    params: [{ name: 'id', type: 'path', description: 'Service ID' }],
    hasBody: false,
  },

  // Schedules
  {
    id: 'schedule-create',
    group: 'Schedules',
    name: 'Create Schedule',
    method: 'POST',
    path: '/api/v1/schedules',
    description: 'Create a new schedule.',
    params: [],
    hasBody: true,
    defaultBody: '{\n  "userId": "REPLACE_WITH_USER_ID",\n  "timezone": "UTC",\n  "rules": []\n}'
  },
  {
    id: 'schedule-get',
    group: 'Schedules',
    name: 'Get Schedule',
    method: 'GET',
    path: '/api/v1/schedules/{id}',
    description: 'Get a schedule by ID.',
    params: [{ name: 'id', type: 'path', description: 'Schedule ID' }],
    hasBody: false,
  },
  {
    id: 'schedule-get-by-user',
    group: 'Schedules',
    name: 'Get Schedules by User',
    method: 'GET',
    path: '/api/v1/schedules/user/{userId}',
    description: 'Get all schedules for a given user.',
    params: [{ name: 'userId', type: 'path', description: 'User ID' }],
    hasBody: false,
  },
  {
    id: 'schedule-get-meta',
    group: 'Schedules',
    name: 'Get Schedules by Metadata',
    method: 'GET',
    path: '/api/v1/schedules/meta',
    description: 'Find schedules using metadata.',
    params: [
      { name: 'key', type: 'query', description: 'Metadata key' },
      { name: 'value', type: 'query', description: 'Metadata value' }
    ],
    hasBody: false,
  },
  {
    id: 'schedule-update',
    group: 'Schedules',
    name: 'Update Schedule',
    method: 'PUT',
    path: '/api/v1/schedules/{id}',
    description: 'Update a schedule.',
    params: [{ name: 'id', type: 'path', description: 'Schedule ID' }],
    hasBody: true,
    defaultBody: '{\n  "timezone": "UTC",\n  "rules": []\n}'
  },
  {
    id: 'schedule-delete',
    group: 'Schedules',
    name: 'Delete Schedule',
    method: 'DELETE',
    path: '/api/v1/schedules/{id}',
    description: 'Delete a schedule.',
    params: [{ name: 'id', type: 'path', description: 'Schedule ID' }],
    hasBody: false,
  }
];
