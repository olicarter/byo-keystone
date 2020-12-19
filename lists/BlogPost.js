const { Select, Text } = require('@keystonejs/fields');
const { Markdown } = require('@keystonejs/fields-markdown');
const { atTracking, byTracking, logging } = require('@keystonejs/list-plugins');

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
  plugins: [atTracking(), byTracking(), logging(console.log)],
};
