const { Decimal, Select } = require('@keystonejs/fields');
const { atTracking, byTracking, logging } = require('@keystonejs/list-plugins');

module.exports = {
  fields: {
    price: {
      type: Decimal,
      isRequired: true,
    },
    size: {
      type: Decimal,
      isRequired: true,
    },
    unit: {
      type: Select,
      options: ['g', 'ml'],
      isRequired: true,
    },
    type: {
      type: Select,
      options: ['bag', 'bottle', 'jar'],
      isRequired: true,
    },
  },
  labelResolver: item => `${item.size}${item.unit} ${item.type}`,
  plugins: [atTracking(), byTracking(), logging(console.log)],
};
