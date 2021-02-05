const { gql } = require('apollo-server-express');

const { OrderItem } = require('../../fragments');

const GET_ORDER_ITEM = gql`
  query($id: ID!) {
    OrderItem(where: { id: $id }) {
      quantity
    }
  }
`;

const UPDATE_ORDER_ITEM_QUANTITY = gql`
  mutation ($id: ID!, $quantity: Int!) {
    updateOrderItem(id: $id, data: { quantity: $quantity }) {
      ${OrderItem}
    }
  }
`;

module.exports = {
  schema: 'incrementOrderItem(id: ID!): OrderItem',
  resolver: async (_, { id }, { createContext, executeGraphQL }) => {
    const context = createContext({ skipAccessControl: true });

    const {
      data: { OrderItem } = {},
      errors: getOrderItemErrors,
    } = await executeGraphQL({
      context,
      query: GET_ORDER_ITEM,
      variables: { id },
    });

    if (getOrderItemErrors) throw Error(getOrderItemErrors[0]);

    const { quantity: currQuantity } = OrderItem || {};

    const {
      data: { updateOrderItem: { quantity: updatedQuantity } = {} } = {},
      errors: updateOrderItemQuantityErrors,
    } = await executeGraphQL({
      context,
      query: UPDATE_ORDER_ITEM_QUANTITY,
      variables: { id, quantity: Number(currQuantity) + 1 },
    });

    if (updateOrderItemQuantityErrors) {
      throw Error(updateOrderItemQuantityErrors[0]);
    }

    return { id, quantity: updatedQuantity };
  },
};
