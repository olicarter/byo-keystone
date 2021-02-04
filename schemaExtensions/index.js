const {
  decrementOrderItem,
  incrementOrderItem,
  resetPassword,
  sendContactForm,
  sendPasswordResetEmail,
} = require('./mutations');

module.exports = {
  mutations: [
    decrementOrderItem,
    incrementOrderItem,
    resetPassword,
    sendContactForm,
    sendPasswordResetEmail,
  ],
};
