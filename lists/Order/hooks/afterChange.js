const { DateTime } = require('luxon');
const { gql } = require('apollo-server-express');

const { sendEmail } = require('../../../helpers');

const {
  ADMIN_ORDER_NOTIFICATION_EMAIL_ID,
  CUSTOMER_ORDER_CONFIRMATION_EMAIL_ID,
} = process.env;

const ORDER_QUERY = gql`
  query($id: ID!) {
    Order(where: { id: $id }) {
      orderItems {
        id
      }
    }
  }
`;

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

const ORDER_ITEM_QUERY = gql`
  query($id: ID!) {
    OrderItem(where: { id: $id }) {
      productVariant {
        name
        increment
        incrementPrice
        unit {
          id
        }
        container {
          price
          size
          unit
          type
        }
        product {
          name
          brand {
            name
          }
        }
      }
    }
  }
`;

const UPDATE_ORDER_ITEM_MUTATION = gql`
  mutation($id: ID!, $data: OrderItemUpdateInput!) {
    updateOrderItem(id: $id, data: $data) {
      id
    }
  }
`;

const getAddressVariables = async ({
  addressId,
  createContext,
  executeGraphQL,
}) => {
  if (addressId) {
    const {
      data: {
        Address: { deliveryInstructions, name, phone, postcode, street } = {},
      } = {},
      errors: AddressQueryErrors,
    } = await executeGraphQL({
      context: createContext({ skipAccessControl: true }),
      query: ADDRESS_QUERY,
      variables: { id: addressId.toString() },
    });

    if (AddressQueryErrors) throw Error(AddressQueryErrors[0]);

    return {
      address: `${name}, ${street}, ${postcode}`,
      deliveryInstructions,
      phone,
    };
  } else {
    return {};
  }
};

const getDeliverySlotVariables = async ({
  deliverySlotId,
  createContext,
  executeGraphQL,
}) => {
  if (deliverySlotId) {
    const {
      data: { DeliverySlot: { endTime, startTime } = {} } = {},
      errors: DeliverySlotQueryErrors,
    } = await executeGraphQL({
      context: createContext({ skipAccessControl: true }),
      query: DELIVERY_SLOT_QUERY,
      variables: { id: deliverySlotId.toString() },
    });

    if (DeliverySlotQueryErrors) {
      throw Error(DeliverySlotQueryErrors[0]);
    }

    const st = DateTime.fromISO(startTime, {
      zone: 'Europe/London',
    });
    const et = DateTime.fromISO(endTime, {
      zone: 'Europe/London',
    });

    return {
      deliverySlot: `Arriving between ${st.toFormat(
        "cccc d LLL',' HH':'mm",
      )}-${et.toFormat("HH':'mm")}`,
    };
  } else {
    return {};
  }
};

const getUser = async ({ userId, createContext, executeGraphQL }) => {
  const {
    data: { User = {} } = {},
    errors: UserQueryErrors,
  } = await executeGraphQL({
    context: createContext({ skipAccessControl: true }),
    query: USER_QUERY,
    variables: { id: userId.toString() },
  });

  if (UserQueryErrors) throw Error(UserQueryErrors[0]);

  return User;
};

const saveOrderItemSnapshot = async ({
  orderItemId,
  createContext,
  executeGraphQL,
}) => {
  const {
    data: { OrderItem } = {},
    errors: OrderItemQueryErrors,
  } = await executeGraphQL({
    context: createContext({ skipAccessControl: true }),
    query: ORDER_ITEM_QUERY,
    variables: { id: orderItemId.toString() },
  });

  if (OrderItemQueryErrors) throw Error(OrderItemQueryErrors[0]);

  const { productVariant } = OrderItem || {};
  const {
    container,
    increment: productVariantIncrement,
    incrementPrice: productVariantIncrementPrice,
    name: productVariantName,
    product,
    unit,
  } = productVariant || {};
  const { id: productVariantUnitId } = unit || {};
  const { brand, name: productName } = product || {};
  const { name: productBrand } = brand || {};
  const {
    price: productVariantContainerPrice,
    size: productVariantContainerSize,
    type: productVariantContainerType,
    unit: productVariantContainerUnit,
  } = container || {};

  const { errors: updateOrderItemErrors } = await executeGraphQL({
    context: createContext({ skipAccessControl: true }),
    query: UPDATE_ORDER_ITEM_MUTATION,
    variables: {
      id: orderItemId.toString(),
      data: {
        productBrand,
        productName,
        productVariantContainerPrice,
        productVariantContainerSize,
        productVariantContainerType,
        productVariantContainerUnit,
        productVariantIncrement,
        productVariantIncrementPrice,
        productVariantName,
        ...(productVariantUnitId
          ? { productVariantUnit: { connect: { id: productVariantUnitId } } }
          : {}),
      },
    },
  });

  if (updateOrderItemErrors) {
    return Promise.reject(Error(updateOrderItemErrors[0]));
  }

  return Promise.resolve();
};

module.exports = async ({
  context,
  context: { createContext, executeGraphQL } = {},
  updatedItem: {
    address: addressId,
    deliverySlot: deliverySlotId,
    id: orderId,
    orderNumber,
    phone: userPhone,
    user: userId,
  } = {},
  operation,
  originalInput: { submitted } = {},
}) => {
  if (operation === 'update') {
    if (submitted) {
      try {
        const {
          data: { Order: { orderItems } = {} } = {},
          errors: OrderQueryErrors,
        } = await executeGraphQL({
          context: createContext({ skipAccessControl: true }),
          query: ORDER_QUERY,
          variables: { id: orderId.toString() },
        });

        if (OrderQueryErrors) throw Error(OrderQueryErrors[0]);

        await Promise.all(
          orderItems.map(({ id: orderItemId }) =>
            saveOrderItemSnapshot({
              orderItemId,
              createContext,
              executeGraphQL,
            }),
          ),
        );

        const {
          address = '',
          deliveryInstructions = '',
          phone = userPhone,
        } = await getAddressVariables({
          addressId,
          createContext,
          executeGraphQL,
        });

        const {
          deliverySlot = 'To be collected in store',
        } = await getDeliverySlotVariables({
          deliverySlotId,
          createContext,
          executeGraphQL,
        });

        const user = await getUser({ userId, createContext, executeGraphQL });

        const variables = {
          address,
          deliveryInstructions,
          deliverySlot,
          email: user.email,
          name: user.name,
          orderNumber,
          phone,
        };

        await sendEmail({
          context,
          emailId: CUSTOMER_ORDER_CONFIRMATION_EMAIL_ID,
          to: user,
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
};
