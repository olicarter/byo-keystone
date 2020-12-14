const { Text } = require('@keystonejs/fields');

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
};
