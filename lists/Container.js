const { Decimal, Integer, Select } = require('@keystonejs/fields');

module.exports = {
  fields: {
    price: {
      type: Decimal,
      isRequired: true,
    },
    size: {
      type: Integer,
      isRequired: true,
    },
    unit: {
      type: Select,
      options: ['g', 'ml'],
      isRequired: true,
    },
    type: {
      type: Select,
      options: ['bottle', 'jar'],
      isRequired: true,
    },
  },
  labelResolver: item => `${item.size}${item.unit} ${item.type}`,
};
