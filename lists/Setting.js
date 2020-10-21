const { Integer, Text, Url } = require('@keystonejs/fields');
const { Markdown } = require('@keystonejs/fields-markdown');

module.exports = {
  access: {
    create: false,
    delete: false,
    read: true,
    update: true,
  },
  fields: {
    homeContent: {
      type: Markdown,
      isRequired: true,
    },
    aboutContent: {
      type: Markdown,
      isRequired: true,
    },
    facebookUrl: {
      type: Url,
      isRequired: true,
    },
    instagramUrl: {
      type: Url,
      isRequired: true,
    },
    minOrderValue: {
      type: Integer,
      defaultValue: 20,
    },
    chooseDeliverySlotInfo: {
      type: Text,
      isMultiline: true,
    },
    orderSubmissionInfo: {
      type: Text,
      isMultiline: true,
    },
  },
};
