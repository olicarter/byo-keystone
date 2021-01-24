const { gql } = require('apollo-server-express');

const { sumOrderItems } = require('../../../functions');

const ORDER_QUERY = gql`
  query($id: ID!) {
    Order(where: { id: $id }) {
      orderItems {
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
  }
`;

const SETTINGS_QUERY = gql`
  query {
    allSettings {
      minOrderValue
    }
  }
`;

module.exports = async ({
  addValidationError,
  context: { createContext, executeGraphQL } = {},
  existingItem: { id: orderId } = {},
  operation,
  originalInput: { submitted } = {},
}) => {
  if (operation === 'update') {
    if (submitted) {
      const {
        data: { Order: { orderItems } = {} } = {},
        errors: OrderQueryErrors,
      } = await executeGraphQL({
        context: createContext({ skipAccessControl: true }),
        query: ORDER_QUERY,
        variables: { id: orderId.toString() },
      });

      if (OrderQueryErrors) throw Error(OrderQueryErrors[0]);

      const {
        data: { allSettings } = {},
        errors: SettingsQueryErrors,
      } = await executeGraphQL({
        context: createContext({ skipAccessControl: true }),
        query: SETTINGS_QUERY,
      });

      if (SettingsQueryErrors) throw Error(SettingsQueryErrors[0]);

      const [{ minOrderValue } = {}] = allSettings || [];

      const orderValue = sumOrderItems(orderItems);

      if (isNaN(Number(orderValue)) || isNaN(Number(minOrderValue))) {
        addValidationError('Error submitting order');
      }

      if (Number(orderValue) < Number(minOrderValue)) {
        addValidationError('Order does not meet minimum value');
      }
    }
  }
};
