const { Integer, Relationship } = require('@keystonejs/fields');
const { atTracking, byTracking, logging } = require('@keystonejs/list-plugins');

module.exports = {
  fields: {
    order: {
      type: Relationship,
      ref: 'Order.orderItems',
      many: false,
      isRequired: true,
    },
    productVariant: {
      type: Relationship,
      ref: 'ProductVariant',
      many: false,
      isRequired: true,
    },
    quantity: {
      type: Integer,
      isRequired: true,
    },
  },
  plugins: [atTracking(), byTracking(), logging(console.log)],
};
