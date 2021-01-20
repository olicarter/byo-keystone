const { DateTime } = require('luxon');
const { gql } = require('apollo-server-express');
const pluralize = require('pluralize');

const { sendEmail } = require('../../../functions');

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
      id
      quantity
      productVariant {
        id
        name
        increment
        incrementPrice
        unit {
          id
          pluralAbbreviated
          singularAbbreviated
        }
        container {
          id
          price
          size
          unit
          type
        }
        product {
          id
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
  const { name: productBrandName } = brand || {};
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
        productBrandName,
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

  return Promise.resolve(OrderItem);
};

const saveOrderItemSnapshots = async ({
  orderId,
  createContext,
  executeGraphQL,
}) => {
  const {
    data: { Order: { orderItems } = {} } = {},
    errors: OrderQueryErrors,
  } = await executeGraphQL({
    context: createContext({ skipAccessControl: true }),
    query: ORDER_QUERY,
    variables: { id: orderId.toString() },
  });

  if (OrderQueryErrors) throw Error(OrderQueryErrors[0]);

  return Promise.all(
    orderItems.map(({ id: orderItemId }) =>
      saveOrderItemSnapshot({
        orderItemId,
        createContext,
        executeGraphQL,
      }),
    ),
  );
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
        const orderItems = await saveOrderItemSnapshots({
          orderId,
          createContext,
          executeGraphQL,
        });

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

        const orderItemsByProduct = [];
        const uniqueProductIds = [];
        orderItems.forEach(i => {
          if (!uniqueProductIds.includes(i.productVariant.product.id)) {
            uniqueProductIds.push(i.productVariant.product.id);
          }
          const uniqueProductIdIndex = uniqueProductIds.indexOf(
            i.productVariant.product.id,
          );
          orderItemsByProduct[uniqueProductIdIndex] = [
            ...(orderItemsByProduct[uniqueProductIdIndex] || []),
            i,
          ];
        });

        let orderItemsParsed = '';

        orderItemsByProduct.forEach(orderItems => {
          const [
            {
              productVariant: {
                product: { brand, name: productName },
              },
            },
          ] = orderItems;

          const { name: brandName } = brand || {};

          orderItemsParsed += `<table>${
            brandName
              ? `<tr><td colspan="1" style="color: #7f7f7f;">${brandName}</td></tr>`
              : ''
          }<tr><td colspan="1" style="font-size: 16px; font-weight: 600;">${productName}</td></tr>${orderItems.map(
            ({
              productVariant: {
                container,
                increment,
                incrementPrice,
                name: productVariantName,
                unit,
              },
              quantity,
            }) => {
              const isLoose =
                ['g', 'kg', 'ml', 'L', ' liner', ' tampon', ' pad'].includes(
                  unit.singularAbbreviated,
                ) &&
                (!container || (container && Number(container.price)));

              // const formatPrice = price => (Number(price) * 1).toFixed(2);

              return `${
                productVariantName
                  ? `<tr><td colspan="1" style="font-size: 13px;">${productVariantName}</td></tr>`
                  : ''
              }<tr><td><span>${
                isLoose ? '' : `${quantity} x `
              }</span><span>${`${isLoose ? increment * quantity : increment}${
                unit.pluralAbbreviated
              }`}</span>${
                container && Number(container.price)
                  ? `<span style="color: #7f7f7f;"> in returnable ${
                      container.size
                    }${container.unit} ${pluralize(
                      container.type,
                      quantity,
                    )}</span>`
                  : ''
              }${
                container && !Number(container.price)
                  ? `<span> ${container.type}</span>`
                  : ''
              }</td>
              </tr>`;
            },
          )}</table>`;
        });

        // Order item price cell, change colspan values back to 2 if putting
        // back in email template
        //
        // <td>£${formatPrice(
        //   incrementPrice * quantity,
        // )}${
        //   container && Number(container.price)
        //     ? `<span style="color: #7f7f7f;"> + £${formatPrice(
        //         container.price * quantity,
        //       )}</span>`
        //     : ''
        // }</td>

        const variables = {
          address,
          deliveryInstructions,
          deliverySlot,
          email: user.email,
          name: user.name,
          orderItems: orderItemsParsed,
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
