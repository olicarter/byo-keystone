const { Select, Text } = require('@keystonejs/fields');
const { Markdown } = require('@keystonejs/fields-markdown');

module.exports = {
  fields: {
    title: {
      type: Text,
      isRequired: true,
    },
    content: {
      type: Markdown,
      isRequired: true,
    },
    status: {
      type: Select,
      options: ['draft', 'published'],
      defaultValue: 'draft',
    },
  },
};
