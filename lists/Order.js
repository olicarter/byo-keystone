const {
  Checkbox,
  DateTime,
  Relationship,
  Text,
} = require('@keystonejs/fields');
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
      address
      deliveryInstructions
      name
      phone
      postcode
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
    },
    paidAt: {
      type: DateTime,
    },
    submitted: {
      type: Checkbox,
    },
    user: {
      type: Relationship,
      ref: 'User.orders',
      many: false,
    },
    createdAt: {
      type: DateTime,
      defaultValue: () => new Date().toISOString(),
    },
  },
  hooks: {
    beforeChange: async ({
      context,
      context: { createContext, executeGraphQL } = {},
      existingItem: {
        address: addressId,
        deliverySlot: deliverySlotId,
        orderNumber,
        user: userId,
      } = {},
      operation,
      originalInput: { submitted } = {},
    }) => {
      if (operation === 'update' && submitted) {
        try {
          const {
            data: {
              Address: {
                address,
                deliveryInstructions,
                name,
                phone,
                postcode,
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
          if (DeliverySlotQueryErrors) throw Error(DeliverySlotQueryErrors[0]);
          if (UserQueryErrors) throw Error(UserQueryErrors[0]);

          const addressString = `${name}, ${address}, ${postcode}`;

          const st = LuxonDateTime.fromISO(startTime, {
            zone: 'Europe/London',
          });
          const et = LuxonDateTime.fromISO(endTime, { zone: 'Europe/London' });
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
    },
  },
  labelField: 'orderNumber',
};
