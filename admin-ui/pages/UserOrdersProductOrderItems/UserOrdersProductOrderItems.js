import React from 'react';

import { formatPrice } from '../functions';

import * as Styled from './UserOrdersProductOrderItems.styled';

export const UserOrdersProductOrderItems = ({ orderItems }) => {
  const [
    {
      productVariant: {
        product: { brand, name: productName },
      },
    },
  ] = orderItems;
  return (
    <Styled.Section>
      <Styled.OrderItemHeader>
        <div>
          <Styled.Name>{productName}</Styled.Name>
        </div>
        <span>
          {/* £
          {
            +parseFloat(
              Math.round(
                orderItems.reduce(
                  (prev, curr) =>
                    prev +
                    Number(curr.quantity) *
                      Number(curr.productVariant.incrementPrice),
                  0,
                ) * 100,
              ) / 100,
            )
          } */}
        </span>
      </Styled.OrderItemHeader>
      {orderItems.map(
        ({
          quantity,
          productVariant: {
            container,
            increment,
            incrementPrice,
            name: productVariantName,
            unit,
          },
        }) => (
          <Styled.Row>
            <Styled.OrderItemProduct>
              <span>
                {quantity} <Styled.ContainerInfo>x</Styled.ContainerInfo>{' '}
                {container && productVariantName ? (
                  <span>
                    {container.size}
                    {container.unit} {container.type}{' '}
                    <Styled.ContainerInfo>of</Styled.ContainerInfo>{' '}
                  </span>
                ) : null}
              </span>

              {productVariantName ? (
                <>
                  <span>{productVariantName}</span>
                </>
              ) : (
                <>
                  <span>
                    {increment}
                    {unit.pluralAbbreviated}
                  </span>
                  {container ? (
                    <Styled.ContainerInfo>
                      {' '}
                      + {container.size}
                      {container.unit} {container.type}
                    </Styled.ContainerInfo>
                  ) : null}
                </>
              )}
            </Styled.OrderItemProduct>
            <Styled.Price>
              <span>£{formatPrice(incrementPrice * quantity)}</span>{' '}
              {container && Number(container.price) ? (
                <Styled.ContainerInfo>
                  + £{formatPrice(container.price * quantity)}
                </Styled.ContainerInfo>
              ) : null}
            </Styled.Price>
          </Styled.Row>
        ),
      )}
    </Styled.Section>
  );
};
