const { Text } = require('@keystonejs/fields');
const { atTracking, byTracking, logging } = require('@keystonejs/list-plugins');

module.exports = {
  adminConfig: {
    defaultColumns: 'postcode',
  },
  adminDoc: 'Allowed delivery postcode prefixes.',
  fields: {
    postcode: {
      type: Text,
      isRequired: true,
    },
  },
  labelField: 'postcode',
  plugins: [atTracking(), byTracking(), logging(console.log)],
};
