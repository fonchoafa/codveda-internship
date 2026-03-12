const { gql } = require('graphql-tag');

const postTypeDefs = gql`
  type Post {
    id: ID!
    title: String!
    content: String!
    author: User
    tags: [String]
    isPublished: Boolean
    createdAt: String
  }

  type Query {
    getPosts: [Post!]!
    getPostById(id: ID!): Post
    getMyPosts: [Post!]!
  }

  type Mutation {
    createPost(
      title: String!
      content: String!
      tags: [String]
      isPublished: Boolean
    ): Post!

    updatePost(
      id: ID!
      title: String
      content: String
      tags: [String]
      isPublished: Boolean
    ): Post!

    deletePost(id: ID!): String
  }
`;

module.exports = postTypeDefs;