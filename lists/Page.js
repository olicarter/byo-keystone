const { Text } = require('@keystonejs/fields');
const { Markdown } = require('@keystonejs/fields-markdown');
const { atTracking, byTracking, logging } = require('@keystonejs/list-plugins');

module.exports = {
  access: {
    create: ({ authentication: { item: { isSuperAdmin } = {} } = {} }) =>
      !!isSuperAdmin,
    delete: false,
    read: true,
    update: ({ authentication: { item: { isAdmin } = {} } = {} }) => !!isAdmin,
  },
  fields: {
    name: {
      adminDoc: 'Name of page.',
      type: Text,
      isRequired: true,
      isUnique: true,
    },
    path: {
      adminDoc: 'URL path of page, relative to root URL.',
      type: Text,
      isRequired: true,
      isUnique: true,
    },
    title: {
      adminDoc: 'Text shown in browser tab.',
      type: Text,
      isRequired: true,
    },
    message: {
      adminDoc:
        'Any text here will show and populate a message at top of page.',
      type: Text,
    },
    heading: {
      adminDoc: 'Heading displayed at top of page, below message.',
      type: Text,
    },
    info: {
      adminDoc:
        'Optional markdown rendered below heading. Good for general info on home and about pages etc.',
      type: Markdown,
    },
  },
  plugins: [atTracking(), byTracking(), logging(console.log)],
};
