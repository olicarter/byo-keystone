const { Decimal, Select } = require('@keystonejs/fields');
const { atTracking, byTracking, logging } = require('@keystonejs/list-plugins');

module.exports = {
  access: {
    create: ({ authentication: { item: { isAdmin } = {} } = {} }) => !!isAdmin,
    delete: ({ authentication: { item: { isAdmin } = {} } = {} }) => !!isAdmin,
    update: ({ authentication: { item: { isAdmin } = {} } = {} }) => !!isAdmin,
  },
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
      options: ['g', 'kg', 'ml', 'L'],
      isRequired: true,
    },
    type: {
      type: Select,
      options: ['bag', 'bottle', 'jar', 'tin'],
      isRequired: true,
    },
  },
  labelResolver: item =>
    `${item.size}${item.unit} ${item.type} - £${item.price}`,
  plugins: [atTracking(), byTracking(), logging(console.log)],
};
