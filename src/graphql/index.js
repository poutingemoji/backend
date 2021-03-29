const { GraphQLSchema } = require("graphql");
const {
  GraphQLList,
  GraphQLString,
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLInt,
} = require("graphql");
const { getUserGuilds } = require("../utils/api");

const GuildType = new GraphQLObjectType({
  name: "GuildType",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    icon: { type: GraphQLString },
    owner: { type: GraphQLBoolean },
    permissions: { type: GraphQLInt },
    features: { type: new GraphQLList(GraphQLString) },
    permissions_new: { type: GraphQLString },
  }),
});

const UserType = new GraphQLObjectType({
  name: "UserType",
  fields: () => ({
    discordTag: { type: GraphQLString },
    discordId: { type: GraphQLString },
    avatar: { type: GraphQLString },
    guilds: {
      type: new GraphQLList(GuildType),
      resolve(parent, args, request) {
        return request.user ? getUserGuilds(request.user.discordId) : null
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    getUser: {
      type: UserType,
      resolve(parent, args, request) {
        return request.user ? request.user : null
      },
    },
  },
});

module.exports = new GraphQLSchema({ query: RootQuery });
