const { gql } = require('apollo-server-express');
const { v4: uuid } = require('uuid');

const sendEmail = require('../../helpers');

const { BYO_UI_URL, CUSTOMER_RESET_PASSWORD_EMAIL_ID } = process.env;

const GET_USERS_BY_EMAIL = gql`
  query($email: String!) {
    allUsers(where: { email: $email }) {
      id
      email
      name
    }
  }
`;

const UPDATE_USER = gql`
  mutation($id: ID!, $token: String!) {
    updateUser(id: $id, data: { passwordResetToken: $token }) {
      id
    }
  }
`;

module.exports = {
  schema: 'sendPasswordResetEmail(email: String!): Boolean',
  resolver: async (_, { email: emailArg }, context) => {
    const { createContext, executeGraphQL } = context;

    const queryContext = createContext({ skipAccessControl: true });

    const {
      data: { allUsers } = {},
      errors: getUserErrors,
    } = await executeGraphQL({
      context: queryContext,
      query: GET_USERS_BY_EMAIL,
      variables: { email: emailArg },
    });

    if (getUserErrors) throw Error(getUserErrors[0]);

    if (!Array.isArray(allUsers) || !allUsers.length) {
      throw Error('User not found');
    }

    const [{ id, email, name } = {}] = allUsers;

    const token = uuid();
    const resetPasswordLink = `${BYO_UI_URL}/reset-password?email=${email}&token=${token}`;

    const { errors: updateUserErrors } = await executeGraphQL({
      context: queryContext,
      query: UPDATE_USER,
      variables: { id, token },
    });

    if (updateUserErrors) throw Error(updateUserErrors[0]);

    const variables = { email, name, resetPasswordLink };

    await sendEmail({
      context,
      emailId: CUSTOMER_RESET_PASSWORD_EMAIL_ID,
      to: { email, name },
      variables,
    });

    return true;
  },
};
