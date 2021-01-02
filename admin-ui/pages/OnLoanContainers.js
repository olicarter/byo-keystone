import React from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';

const GET_ON_LOAN_CONTAINERS = gql`
  query GetOrdersWithOnLoanContainers {
    allOrders(
      where: {
        AND: [
          { paid: true }
          {
            orderItems_some: {
              AND: [
                { isContainerReturned: false }
                { productVariant: { container_is_null: false } }
              ]
            }
          }
        ]
      }
    ) {
      id
      orderNumber
      orderItems {
        id
        isContainerReturned
        quantity
        productVariant {
          id
          product {
            id
            name
          }
          container {
            id
            price
            size
            unit
            type
          }
        }
      }
    }
  }
`;

const UPDATE_ORDER_ITEM = gql`
  mutation($id: ID!) {
    updateOrderItem(id: $id, data: { isContainerReturned: true }) {
      id
      isContainerReturned
      quantity
      productVariant {
        id
        product {
          id
          name
        }
        container {
          id
          price
          size
          unit
          type
        }
      }
    }
  }
`;

export const OnLoanContainers = () => {
  const { data: { allOrders = [] } = {} } = useQuery(GET_ON_LOAN_CONTAINERS);

  const [updateOrderItem] = useMutation(UPDATE_ORDER_ITEM);

  return allOrders.map(({ id: orderId, orderNumber, orderItems }) => (
    <div key={orderId}>
      <h2>#{orderNumber}</h2>
      {orderItems.map(
        ({
          id: orderItemId,
          isContainerReturned,
          productVariant: { container },
          quantity,
        }) =>
          container && !isContainerReturned ? (
            <div key={orderItemId}>
              <span>{quantity}</span>
              <span>
                {' '}
                x {container.size}
                {container.unit} {container.type}
              </span>
              <button
                onClick={() =>
                  updateOrderItem({ variables: { id: orderItemId } })
                }
              >
                Container has been returned
              </button>
            </div>
          ) : null,
      )}
    </div>
  ));
};
