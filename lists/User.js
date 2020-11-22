const {
  Checkbox,
  Password,
  Relationship,
  Text,
} = require('@keystonejs/fields');
const { gql } = require('apollo-server-express');
const { compiler } = require('markdown-to-jsx');
const { renderToStaticMarkup } = require('react-dom/server');
const Mustache = require('mustache');

const mailgun = require('../mailgun');

module.exports = {
  access: {
    auth: true,
  },
  fields: {
    email: {
      type: Text,
      isRequired: true,
      isUnique: true,
      // access: ({
      //   existingItem,
      //   authentication,
      //   authentication: { item: { id: itemId, isAdmin } = {} } = {},
      // }) => {
      //   console.log('authentication', authentication);
      //   console.log('existingItem', existingItem);
      //   console.log('itemId', itemId);
      //   return isAdmin || existingItem.id === itemId;
      // },
    },
    password: {
      type: Password,
      access: {
        // 3. Only admins can see if a password is set. No-one can read their own or other user's passwords.
        read: ({ authentication: { item: { isAdmin } = {} } = {} }) => isAdmin,
        // 4. Only authenticated users can update their own password. Admins can update anyone's password.
        update: ({
          existingItem,
          authentication: { item: { id: itemId, isAdmin } = {} },
        }) => {
          return isAdmin || existingItem.id === itemId;
        },
      },
    },
    name: {
      type: Text,
      isRequired: true,
    },
    phone: {
      type: Text,
      isRequired: true,
    },
    orders: {
      type: Relationship,
      ref: 'Order.user',
      many: true,
    },
    addresses: {
      type: Relationship,
      ref: 'Address',
      many: true,
    },
    isAdmin: {
      type: Checkbox,
      defaultValue: false,
    },
  },
  hooks: {
    afterChange: async ({
      context: { executeGraphQL } = {},
      operation,
      updatedItem: { email, name } = {},
    }) => {
      if (operation === 'create') {
        try {
          const {
            data: { allSettings: [{ newUserEmailContent } = {}] = [] } = {},
            errors,
          } = await executeGraphQL({
            query: gql`
              {
                allSettings {
                  newUserEmailContent
                }
              }
            `,
          });

          if (errors) throw Error(errors[0]);

          const html = Mustache.render(
            renderToStaticMarkup(compiler(newUserEmailContent)),
            { name },
          );

          const res = await mailgun.messages().send({
            from: 'Bring Your Own <noreply@byoshop.co.uk>',
            to: `${name} <${email}>`,
            subject: 'Welcome to BYO',
            html,
          });

          console.log('New user email response', res);
        } catch (error) {
          console.error('New user email error', error);
        }
      }
    },
  },
  labelField: 'email',
};
