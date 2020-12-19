const { Decimal, Integer, Relationship } = require('@keystonejs/fields');
const { atTracking, byTracking, logging } = require('@keystonejs/list-plugins');

module.exports = {
  fields: {
    product: {
      type: Relationship,
      ref: 'Product.variants',
      many: false,
    },
    increment: {
      type: Integer,
      isRequired: true,
    },
    incrementPrice: {
      type: Decimal,
      isRequired: true,
    },
    tags: {
      type: Relationship,
      ref: 'Tag',
      many: true,
    },
    unit: {
      type: Relationship,
      ref: 'Unit',
      isRequired: true,
    },
    container: {
      type: Relationship,
      ref: 'Container',
    },
  },
  plugins: [atTracking(), byTracking(), logging(console.log)],
};
