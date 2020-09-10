const { Relationship } = require("@keystonejs/fields");

module.exports = {
  fields: {
    orderItems: { type: Relationship, ref: "OrderItem.order", many: true },
    user: { type: Relationship, ref: "User.orders", many: false },
  },
};
