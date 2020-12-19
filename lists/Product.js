const { Relationship, Slug, Text } = require('@keystonejs/fields');
const { atTracking, byTracking, logging } = require('@keystonejs/list-plugins');

module.exports = {
  fields: {
    name: { type: Text, isRequired: true, isUnique: true },
    slug: { type: Slug },
    category: {
      type: Relationship,
      ref: 'Category.products',
      many: false,
      isRequired: true,
    },
    allergenInfo: {
      type: Text,
    },
    deliveryInfo: {
      type: Text,
    },
    ingredients: {
      type: Text,
    },
    origin: {
      type: Text,
    },
    tags: {
      type: Relationship,
      ref: 'Tag.products',
      many: true,
    },
    variants: {
      type: Relationship,
      ref: 'ProductVariant.product',
      many: true,
    },
  },
  plugins: [atTracking(), byTracking(), logging(console.log)],
};
