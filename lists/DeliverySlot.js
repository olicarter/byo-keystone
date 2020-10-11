const { DateTime, Integer, Relationship } = require('@keystonejs/fields');

module.exports = {
  fields: {
    startTime: {
      type: DateTime,
      isRequired: true,
    },
    endTime: {
      type: DateTime,
      isRequired: true,
    },
    maxOrders: {
      type: Integer,
      defaultValue: 30,
    },
    orders: {
      type: Relationship,
      ref: 'Order.deliverySlot',
      many: true,
    },
  },
};
