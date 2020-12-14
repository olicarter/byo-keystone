const { Text } = require('@keystonejs/fields');

module.exports = {
  fields: {
    street: {
      type: Text,
      isRequired: true,
    },
    deliveryInstructions: {
      type: Text,
    },
    name: {
      type: Text,
      isRequired: true,
    },
    phone: {
      type: Text,
      isRequired: true,
    },
    postcode: {
      type: Text,
      isRequired: true,
    },
  },
  labelResolver: ({ street, postcode }) => `${street}, ${postcode}`,
};
