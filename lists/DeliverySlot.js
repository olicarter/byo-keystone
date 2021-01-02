const { DateTimeUtc, Integer, Relationship } = require('@keystonejs/fields');
const { atTracking, byTracking, logging } = require('@keystonejs/list-plugins');

module.exports = {
  access: {
    create: ({ authentication: { item: { isAdmin } = {} } = {} }) => !!isAdmin,
    delete: ({ authentication: { item: { isAdmin } = {} } = {} }) => !!isAdmin,
    update: ({ authentication: { item: { isAdmin } = {} } = {} }) => !!isAdmin,
  },
  fields: {
    startTime: {
      type: DateTimeUtc,
      isRequired: true,
    },
    endTime: {
      type: DateTimeUtc,
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
  plugins: [atTracking(), byTracking(), logging(console.log)],
};
