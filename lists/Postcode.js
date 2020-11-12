const { Text } = require('@keystonejs/fields');

module.exports = {
  fields: {
    postcode: {
      type: Text,
      isRequired: true,
    },
  },
};
