const { Relationship, Slug, Text, Virtual } = require("@keystonejs/fields");

module.exports = {
  fields: {
    name: { type: Text, isRequired: true, isUnique: true },
    slug: { type: Slug },
    products: {
      type: Relationship,
      ref: "Product.tags",
      many: true,
    },
  },
};
