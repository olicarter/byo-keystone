const { Text } = require('@keystonejs/fields');
const { atTracking, byTracking, logging } = require('@keystonejs/list-plugins');

module.exports = {
  adminConfig: {
    defaultColumns: 'postcode',
  },
  adminDoc: 'Allowed postcode outcodes for delivery',
  access: {
    create: ({ authentication: { item: { isAdmin } = {} } = {} }) => !!isAdmin,
    delete: ({ authentication: { item: { isAdmin } = {} } = {} }) => !!isAdmin,
    update: ({ authentication: { item: { isAdmin } = {} } = {} }) => !!isAdmin,
  },
  fields: {
    postcode: {
      type: Text,
      isRequired: true,
    },
  },
  labelField: 'postcode',
  plugins: [atTracking(), byTracking(), logging(console.log)],
};
