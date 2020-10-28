const { Checkbox, DateTime, Relationship } = require('@keystonejs/fields');

module.exports = {
  fields: {
    address: {
      type: Relationship,
      ref: 'Address',
      many: false,
    },
    orderAddress: {
      type: Relationship,
      ref: 'OrderAddress',
      many: false,
    },
    deliverySlot: {
      type: Relationship,
      ref: 'DeliverySlot.orders',
      many: false,
    },
    orderItems: {
      type: Relationship,
      ref: 'OrderItem.order',
      many: true,
    },
    paid: {
      type: Checkbox,
    },
    paidAt: {
      type: DateTime,
    },
    submitted: {
      type: Checkbox,
    },
    user: {
      type: Relationship,
      ref: 'User.orders',
      many: false,
    },
    createdAt: {
      type: DateTime,
      defaultValue: () => new Date().toISOString(),
    },
  },
};
