const { Relationship, Slug, Text } = require("@keystonejs/fields");

module.exports = {
  fields: {
    name: { type: Text, isRequired: true, isUnique: true },
    slug: { type: Slug },
    category: {
      type: Relationship,
      ref: "Category.products",
      many: false,
      isRequired: true,
    },
    variants: {
      type: Relationship,
      ref: "ProductVariant.product",
      many: true,
    },
    tags: {
      type: Relationship,
      ref: "Tag.products",
      many: true,
    },
  },
};
