const { Relationship, Slug, Text } = require('@keystonejs/fields');
const { atTracking, byTracking, logging } = require('@keystonejs/list-plugins');

module.exports = {
  fields: {
    name: { type: Text, isRequired: true, isUnique: true },
    slug: { type: Slug },
    abbreviation: { type: Text },
    products: {
      type: Relationship,
      ref: 'Product.tags',
      many: true,
    },
  },
  plugins: [atTracking(), byTracking(), logging(console.log)],
};
