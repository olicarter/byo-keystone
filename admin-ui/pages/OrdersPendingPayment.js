import React from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { DateTime } from 'luxon';

import * as Styled from './UserOrders.styled';
import { formatPrice } from './functions';
import { Card } from './Card';
import { UserOrdersProductOrderItems } from './UserOrdersProductOrderItems';

const GET_SUBMITTED_AND_UNPAID_ORDERS = gql`
  query GetOrdersWithOnLoanContainers {
    allOrders(where: { paid: false, submitted: true }) {
      id
      deliverySlot {
        id
        startTime
        endTime
      }
      orderNumber
      orderItems {
        id
        quantity
        productVariant {
          id
          name
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
          unit {
            id
            pluralAbbreviated
          }
        }
      }
      paid
    }
  }
`;

const UPDATE_ORDER_ITEM = gql`
  mutation($id: ID!) {
    updateOrderItem(id: $id, data: { paid: true }) {
      id
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

export const OrdersPendingPayment = () => {
  const { data: { allOrders = [] } = {} } = useQuery(
    GET_SUBMITTED_AND_UNPAID_ORDERS,
  );

  const [updateOrderItem] = useMutation(UPDATE_ORDER_ITEM);

  return allOrders.map(
    ({ id, deliverySlot, orderNumber, orderItems = [], paid }) => {
      if (!deliverySlot) return null;

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

      const totalContainerPrice =
        Math.round(
          orderItems.reduce(
            (prev, curr) =>
              curr.productVariant.container
                ? prev +
                  Number(curr.quantity) *
                    Number(curr.productVariant.container.price)
                : prev,
            0,
          ) * 100,
        ) / 100;

      const totalOrderValue =
        Math.round(
          orderItems.reduce(
            (prev, curr) =>
              prev +
              Number(curr.quantity) *
                Number(curr.productVariant.incrementPrice),
            0,
          ) * 100,
        ) / 100;

      const { startTime, endTime } = deliverySlot || {};

      const st = DateTime.fromISO(startTime, {
        zone: 'Europe/London',
      }).toLocaleString(DateTime.TIME_SIMPLE);
      const et = DateTime.fromISO(endTime, {
        zone: 'Europe/London',
      }).toLocaleString(DateTime.TIME_SIMPLE);
      const day = DateTime.fromISO(startTime, {
        zone: 'Europe/London',
      }).toFormat('cccc d LLLL');

      return (
        <Card key={id} margin="1rem 0 0">
          <Styled.CardContent>
            <Styled.Section>
              <Styled.Header as="header">
                <Styled.OrderId>#{orderNumber}</Styled.OrderId>
                <div>
                  <span>£{formatPrice(totalOrderValue)}</span>
                  <Styled.TotalContainerPrice>
                    {totalContainerPrice ? (
                      <span> + £{formatPrice(totalContainerPrice)}</span>
                    ) : null}
                  </Styled.TotalContainerPrice>
                </div>
              </Styled.Header>
            </Styled.Section>

            <Styled.Section>
              <Styled.Row>
                <Styled.Status>
                  {paid
                    ? 'Delivered'
                    : `Delivery between ${st} and ${et} on ${day}`}
                </Styled.Status>
              </Styled.Row>
            </Styled.Section>

            {orderItemsByProduct.map(orderItems => (
              <UserOrdersProductOrderItems orderItems={orderItems} />
            ))}
          </Styled.CardContent>
        </Card>
      );
    },
  );
};
