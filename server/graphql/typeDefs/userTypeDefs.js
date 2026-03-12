const { gql } = require('graphql-tag');

const userTypeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
    createdAt: String
  }

  type AuthPayload {
    token: String!
    user: User!
    message: String!
  }

  type Query {
    getUsers: [User!]!
    getUserById(id: ID!): User
    getProfile: User
  }

  type Mutation {
    signup(name: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
  }
`;

module.exports = userTypeDefs;