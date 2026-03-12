const { mergeTypeDefs, mergeResolvers } = require('@graphql-tools/merge');
const userTypeDefs = require('./typeDefs/userTypeDefs');
const postTypeDefs = require('./typeDefs/postTypeDefs');
const userResolvers = require('./resolvers/userResolvers');
const postResolvers = require('./resolvers/postResolvers');

const typeDefs = mergeTypeDefs([userTypeDefs, postTypeDefs]);
const resolvers = mergeResolvers([userResolvers, postResolvers]);

module.exports = { typeDefs, resolvers };