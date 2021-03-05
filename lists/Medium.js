const { Virtual } = require('@keystonejs/fields');
const { CloudinaryImage } = require('@keystonejs/fields-cloudinary-image');
const { atTracking, byTracking, logging } = require('@keystonejs/list-plugins');
const { gql } = require('apollo-server-express');

const {
  fileAdapters: { cloudinaryAdapter: adapter },
} = require('../functions');

const MEDIA_QUERY = gql`
  query($id: ID!) {
    Medium(where: { id: $id }) {
      asset {
        publicUrl
      }
    }
  }
`;

module.exports = {
  fields: {
    asset: {
      adapter,
      type: CloudinaryImage,
      isRequired: true,
    },
    url: {
      type: Virtual,
      resolver: async (item, args, context) => {
        const {
          data,
          data: { Medium: { asset: { publicUrl } } = {} } = {},
          errors,
        } = await context.executeGraphQL({
          query: MEDIA_QUERY,
          variables: { id: item.id },
        });

        if (errors) throw Error(errors[0]);

        return publicUrl;
      },
    },
  },
  plugins: [atTracking(), byTracking(), logging(console.log)],
  plural: 'Media',
};
