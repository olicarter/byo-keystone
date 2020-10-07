const { Text } = require('@keystonejs/fields');

module.exports = {
  fields: {
    firstName: {
      type: Text,
      isRequired: true,
    },
    lastName: {
      type: Text,
      isRequired: true,
    },
    phoneNumber: {
      type: Text,
      isRequired: true,
    },
    street: {
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
