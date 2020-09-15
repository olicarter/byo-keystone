const { Relationship, Slug, Text } = require("@keystonejs/fields");

module.exports = {
  fields: {
    name: { type: Text, isRequired: true, isUnique: true },
    slug: { type: Slug },
    products: {
      type: Relationship,
      ref: "Product.category",
      many: true,
    },
  },
};
