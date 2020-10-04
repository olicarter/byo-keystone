const { Checkbox, Relationship, DateTime } = require("@keystonejs/fields");

module.exports = {
  fields: {
    orderItems: {
      type: Relationship,
      ref: "OrderItem.order",
      many: true,
    },
    paid: {
      type: Checkbox,
    },
    paidAt: {
      type: DateTime,
    },
    user: {
      type: Relationship,
      ref: "User.orders",
      many: false,
    },
  },
};
