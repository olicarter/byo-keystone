const { Select, Slug, Text } = require('@keystonejs/fields');
const { Markdown } = require('@keystonejs/fields-markdown');
const { atTracking, byTracking, logging } = require('@keystonejs/list-plugins');

module.exports = {
  access: {
    create: ({ authentication: { item: { isAdmin } = {} } = {} }) => !!isAdmin,
    delete: ({ authentication: { item: { isAdmin } = {} } = {} }) => !!isAdmin,
    update: ({ authentication: { item: { isAdmin } = {} } = {} }) => !!isAdmin,
  },
  fields: {
    title: {
      type: Text,
      isRequired: true,
    },
    slug: { type: Slug },
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
