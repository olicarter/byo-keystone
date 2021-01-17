const { gql } = require('apollo-server-express');

const updateOrderPaidAtMutation = gql`
  mutation($id: ID!, $paidAt: DateTime!) {
    updateOrder(id: $id, data: { paidAt: $paidAt }) {
      id
    }
  }
`;

module.exports = async ({
  context: { createContext, executeGraphQL } = {},
  existingItem: { id, paid: existingPaid } = {},
  operation,
  updatedItem: { paid: updatedPaid },
}) => {
  if (operation === 'update') {
    let paidAt;
    if (!existingPaid && updatedPaid) paidAt = new Date().toISOString();
    if (existingPaid && !updatedPaid) paidAt = '';
    if (paidAt) {
      const { errors } = await executeGraphQL({
        context: createContext({ skipAccessControl: true }),
        query: updateOrderPaidAtMutation,
        variables: { id, paidAt },
      });

      if (errors) throw Error(errors[0]);
    }
  }
};
