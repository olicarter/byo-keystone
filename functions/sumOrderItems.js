module.exports = orderItems => {
  const { sum = 0 } = orderItems.reduce(
    (prevVal, currVal) => ({
      ...prevVal,
      sum:
        prevVal.sum +
        currVal.quantity * Number(currVal.productVariant.incrementPrice),
    }),
    { productVariant: { incrementPrice: 0 }, sum: 0, quantity: 0 },
  );

  const { totalContainerPrice = 0 } = orderItems.reduce(
    (prevVal, currVal) => {
      if (currVal.productVariant.container)
        return {
          ...prevVal,
          totalContainerPrice:
            prevVal.totalContainerPrice +
            currVal.quantity * Number(currVal.productVariant.container.price),
        };
      else return prevVal;
    },
    {
      productVariant: { container: { price: 0 } },
      totalContainerPrice: 0,
      quantity: 0,
    },
  );

  return sum + totalContainerPrice;
};
