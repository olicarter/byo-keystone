const { Text } = require('@keystonejs/fields');

module.exports = {
  fields: {
    streetName: {
      type: Text,
      isRequired: true,
    },
    flatNumber: {
      type: Text,
      isRequired: true,
    },
    postCode: {
      type: Text,
      isRequired: true,
    },
  },
};
