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
  },
};
