const { gql } = require('apollo-server-express');

const GET_USERS_BY_EMAIL_AND_PASSWORD_RESET_TOKEN = gql`
  query($email: String!, $token: String!) {
    allUsers(where: { email: $email, passwordResetToken: $token }) {
      id
    }
  }
`;

const UPDATE_USER_PASSWORD = gql`
  mutation($id: ID!, $password: String!) {
    updateUser(id: $id, data: { password: $password, passwordResetToken: "" }) {
      id
    }
  }
`;

module.exports = {
  schema:
    'resetPassword(email: String!, password: String!, token: String!): Boolean',
  resolver: async (_, { email, password, token }, context) => {
    const { createContext, executeGraphQL } = context;

    const queryContext = createContext({ skipAccessControl: true });

    const {
      data: { allUsers } = {},
      errors: getUserErrors,
    } = await executeGraphQL({
      context: queryContext,
      query: GET_USERS_BY_EMAIL_AND_PASSWORD_RESET_TOKEN,
      variables: { email, token },
    });

    if (getUserErrors) throw Error(getUserErrors[0]);

    if (!Array.isArray(allUsers) || !allUsers.length) {
      throw Error('User not found');
    }

    const [{ id } = {}] = allUsers;

    const { errors: updateUserPasswordErrors } = await executeGraphQL({
      context: queryContext,
      query: UPDATE_USER_PASSWORD,
      variables: { id, password },
    });

    if (updateUserPasswordErrors) throw Error(updateUserPasswordErrors[0]);

    return true;
  },
};
