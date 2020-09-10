const { Password, Text, Virtual } = require("@keystonejs/fields");

module.exports = {
  fields: {
    email: { type: Text, isRequired: true, isUnique: true },
    firstName: { type: Text, isRequired: true },
    lastName: { type: Text, isRequired: true },
    name: {
      type: Virtual,
      resolver: item => `${item.firstName} ${item.lastName}`,
    },
    orders: {
      orders: { type: Relationship, ref: "Order.user", many: true },
    },
    password: { type: Password },
  },
};
