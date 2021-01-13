const {
  Checkbox,
  DateTime,
  Relationship,
  Text,
} = require('@keystonejs/fields');
const { atTracking, byTracking, logging } = require('@keystonejs/list-plugins');
const { gql } = require('apollo-server-express');
const { DateTime: LuxonDateTime } = require('luxon');

const { sendEmail } = require('../helpers');

const {
  ADMIN_ORDER_NOTIFICATION_EMAIL_ID,
  CUSTOMER_ORDER_CONFIRMATION_EMAIL_ID,
} = process.env;

const ADDRESS_QUERY = gql`
  query($id: ID!) {
    Address(where: { id: $id }) {
      deliveryInstructions
      name
      phone
      postcode
      street
    }
  }
`;

const DELIVERY_SLOT_QUERY = gql`
  query($id: ID!) {
    DeliverySlot(where: { id: $id }) {
      endTime
      startTime
    }
  }
`;

const USER_QUERY = gql`
  query($id: ID!) {
    User(where: { id: $id }) {
      email
      name
    }
  }
`;

module.exports = {
  access: {
    delete: ({ authentication: { item: { isAdmin } = {} } = {} }) => !!isAdmin,
  },
  fields: {
    address: {
      type: Relationship,
      ref: 'Address',
      many: false,
    },
    deliverySlot: {
      type: Relationship,
      ref: 'DeliverySlot.orders',
      many: false,
    },
    orderNumber: {
      access: {
        create: false,
        delete: false,
        update: false,
      },
      type: Text,
      defaultValue: () =>
        Math.floor(100000 + Math.random() * 900000).toString(),
    },
    orderItems: {
      type: Relationship,
      ref: 'OrderItem.order',
      many: true,
    },
    paid: {
      type: Checkbox,
      defaultValue: false,
      access: {
        create: ({ authentication: { item: { isAdmin } = {} } = {} }) =>
          !!isAdmin,
        delete: ({ authentication: { item: { isAdmin } = {} } = {} }) =>
          !!isAdmin,
        update: ({ authentication: { item: { isAdmin } = {} } = {} }) =>
          !!isAdmin,
      },
      hooks: {
        afterChange: async ({
          context: { createContext, executeGraphQL } = {},
          existingItem: { id, paid: existingPaid } = {},
          operation,
          updatedItem: { paid: updatedPaid },
        }) => {
          if (operation === 'update') {
            if (!existingPaid && updatedPaid) {
              const { errors } = await executeGraphQL({
                context: createContext({ skipAccessControl: true }),
                query: gql`
                  mutation($id: ID!, $paidAt: DateTime!) {
                    updateOrder(id: $id, data: { paidAt: $paidAt }) {
                      id
                    }
                  }
                `,
                variables: { id, paidAt: new Date().toISOString() },
              });

              if (errors) throw Error(errors[0]);
            } else if (existingPaid && !updatedPaid) {
              const { errors } = await executeGraphQL({
                context: createContext({ skipAccessControl: true }),
                query: gql`
                  mutation($id: ID!, $paidAt: DateTime!) {
                    updateOrder(id: $id, data: { paidAt: $paidAt }) {
                      id
                    }
                  }
                `,
                variables: { id, paidAt: '' },
              });

              if (errors) throw Error(errors[0]);
            }
          }
        },
      },
    },
    paidAt: {
      access: {
        create: ({ authentication: { item: { isSuperAdmin } = {} } = {} }) =>
          !!isSuperAdmin,
        delete: ({ authentication: { item: { isSuperAdmin } = {} } = {} }) =>
          !!isSuperAdmin,
        update: ({ authentication: { item: { isSuperAdmin } = {} } = {} }) =>
          !!isSuperAdmin,
      },
      type: DateTime,
    },
    submitted: {
      type: Checkbox,
      defaultValue: false,
    },
    user: {
      type: Relationship,
      ref: 'User.orders',
      many: false,
    },
  },
  hooks: {
    afterChange: async ({
      context,
      context: { createContext, executeGraphQL } = {},
      updatedItem: {
        address: addressId,
        deliverySlot: deliverySlotId,
        orderNumber,
        user: userId,
      } = {},
      operation,
      originalInput: { submitted } = {},
    }) => {
      if (operation === 'update') {
        if (submitted) {
          try {
            const {
              data: {
                Address: {
                  deliveryInstructions,
                  name,
                  phone,
                  postcode,
                  street,
                } = {},
              } = {},
              errors: AddressQueryErrors,
            } = await executeGraphQL({
              context: createContext({ skipAccessControl: true }),
              query: ADDRESS_QUERY,
              variables: { id: addressId.toString() },
            });

            const {
              data: { DeliverySlot: { endTime, startTime } = {} } = {},
              errors: DeliverySlotQueryErrors,
            } = await executeGraphQL({
              context: createContext({ skipAccessControl: true }),
              query: DELIVERY_SLOT_QUERY,
              variables: { id: deliverySlotId.toString() },
            });

            const {
              data: { User = {} } = {},
              errors: UserQueryErrors,
            } = await executeGraphQL({
              context: createContext({ skipAccessControl: true }),
              query: USER_QUERY,
              variables: { id: userId.toString() },
            });

            if (AddressQueryErrors) throw Error(AddressQueryErrors[0]);
            if (DeliverySlotQueryErrors)
              throw Error(DeliverySlotQueryErrors[0]);
            if (UserQueryErrors) throw Error(UserQueryErrors[0]);

            const addressString = `${name}, ${street}, ${postcode}`;

            const st = LuxonDateTime.fromISO(startTime, {
              zone: 'Europe/London',
            });
            const et = LuxonDateTime.fromISO(endTime, {
              zone: 'Europe/London',
            });
            const deliverySlot = `${st.toFormat(
              "cccc d LLL',' HH':'mm",
            )}-${et.toFormat("HH':'mm")}`;

            const variables = {
              address: addressString,
              deliveryInstructions,
              deliverySlot,
              email: User.email,
              name: User.name,
              orderNumber,
              phone,
            };

            await sendEmail({
              context,
              emailId: CUSTOMER_ORDER_CONFIRMATION_EMAIL_ID,
              to: User,
              variables,
            });

            await sendEmail({
              context,
              emailId: ADMIN_ORDER_NOTIFICATION_EMAIL_ID,
              variables,
            });
          } catch (error) {
            console.error('Send email error', error);
          }
        }
      }
    },
  },
  labelField: 'orderNumber',
  plugins: [atTracking(), byTracking(), logging(console.log)],
};
