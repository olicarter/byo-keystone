const { Text } = require('@keystonejs/fields');
const { Markdown } = require('@keystonejs/fields-markdown');

module.exports = {
  access: {
    create: ({ authentication: { item: { isSuperAdmin } = {} } = {} }) =>
      isSuperAdmin,
    delete: ({ authentication: { item: { isSuperAdmin } = {} } = {} }) =>
      isSuperAdmin,
    read: ({ authentication: { item: { isAdmin } = {} } = {} }) => isAdmin,
    update: ({ authentication: { item: { isAdmin } = {} } }) => isAdmin,
  },
  adminConfig: {
    defaultColumns: 'subject,fromEmail',
  },
  adminDoc: 'All email templates are defined here.',
  fields: {
    label: {
      adminDoc: 'Short, unique description of email template.',
      type: Text,
      isRequired: true,
      isUnique: true,
    },
    subject: {
      adminDoc: 'Email subject displayed to receiving user.',
      type: Text,
      isRequired: true,
    },
    body: {
      adminDoc: `Email body received by user. Variables written in double curly braces will be replaced by user-specific data. For example, if a user's name is John Doe, "Hello {{name}}" will be sent as "Hello John Doe"`,
      type: Markdown,
      isRequired: true,
    },
    fromEmail: {
      adminDoc: 'From email displayed to receiving user.',
      type: Text,
      isRequired: true,
    },
    fromName: {
      adminDoc: 'Email sender name displayed to receiving user.',
      type: Text,
      isRequired: true,
    },
    toEmail: {
      adminDoc: 'If specified, all emails will be sent to this email address.',
      type: Text,
    },
    toName: {
      adminDoc:
        'If specified, all emails will be sent with this recipient name.',
      type: Text,
    },
    variables: {
      access: {
        read: ({ authentication: { item: { isAdmin } = {} } = {} }) => isAdmin,
        update: ({ authentication: { item: { isSuperAdmin } = {} } }) =>
          isSuperAdmin,
      },
      adminDoc:
        'Available variables for replacing in email templates when written in double curly braces e.g. {{}}',
      type: Text,
    },
  },
  labelField: 'label',
};
