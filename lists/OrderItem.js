const { Integer, Relationship } = require("@keystonejs/fields");

module.exports = {
  fields: {
    order: { type: Relationship, ref: "Order.orderItems", many: false },
    product: { type: Relationship, ref: "Product", many: false },
    quantity: { type: Integer, isRequired: true },
  },
};
