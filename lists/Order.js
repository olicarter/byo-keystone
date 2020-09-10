const { Checkbox, Relationship } = require("@keystonejs/fields");

module.exports = {
  fields: {
    orderItems: { type: Relationship, ref: "OrderItem.order", many: true },
    paid: { type: Checkbox },
    user: { type: Relationship, ref: "User.orders", many: false },
  },
};
