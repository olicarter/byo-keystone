const {
  Decimal,
  Integer,
  Relationship,
  Select,
  Slug,
  Text,
} = require("@keystonejs/fields");

module.exports = {
  fields: {
    name: { type: Text, isRequired: true, isUnique: true },
    slug: { type: Slug },
    price: {
      type: Decimal,
      isRequired: true,
    },
    increments: {
      type: Integer,
      isRequired: true,
    },
    unit: {
      type: Relationship,
      ref: "Unit",
      isRequired: true,
    },
    tags: {
      type: Relationship,
      ref: "Tag.products",
      many: true,
    },
  },
};
