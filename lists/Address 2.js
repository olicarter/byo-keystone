const { Decimal, Text } = require('@keystonejs/fields');

module.exports = {
  fields: {
    streetName: {
      type: Text,
      isRequired: true,
    },
    flatNumber: {
      type: Decimal,
      isRequired: true,
    },
    postCode: {
      type: Decimal,
      isRequired: true,
    },
  },
};
