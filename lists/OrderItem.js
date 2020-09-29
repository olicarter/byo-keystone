const { Integer, Relationship } = require("@keystonejs/fields");

module.exports = {
  fields: {
    order: {
      type: Relationship,
      ref: "Order.orderItems",
      many: false,
      isRequired: true,
    },
    productVariant: {
      type: Relationship,
      ref: "ProductVariant",
      many: false,
      isRequired: true,
    },
    quantity: {
      type: Integer,
      isRequired: true,
    },
  },
};
