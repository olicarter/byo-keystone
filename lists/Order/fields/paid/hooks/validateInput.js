module.exports = async ({
  addFieldValidationError,
  existingItem: { submitted } = {},
  operation,
  originalInput: { paid } = {},
}) => {
  if (operation === 'update') {
    if (paid && !submitted) {
      addFieldValidationError('Order has not been submitted yet');
    }
  }
};
