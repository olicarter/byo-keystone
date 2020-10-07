const { Text } = require('@keystonejs/fields');

module.exports = {
  fields: {
    deliveryFirstName: {
      type: Text,
      isRequired: true,
    },
    deliveryLastName: {
      type: Text,
      isRequired: true,
    },
    deliveryMobile: {
      type: Text,
      isRequired: true,
    },
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
