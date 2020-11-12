const { Relationship, Text } = require('@keystonejs/fields');

module.exports = {
  fields: {
    address: {
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
      type: Relationship,
      ref: 'Postcode',
      many: false,
      isRequired: true,
    },
  },
};
