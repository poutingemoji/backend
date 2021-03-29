const { GraphQLSchema, graphql } = require("graphql");
const {
  GraphQLList,
  GraphQLString,
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLInt,
} = require("graphql");
const { getUserGuilds, getBotGuilds } = require("../utils/api");
const { getMutualGuilds } = require("../utils/utils");
const GuildConfig = require("../database/models/GuildConfig");

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
        return request.user ? getUserGuilds(request.user.discordId) : null;
      },
    },
  }),
});

const MutualGuildType = new GraphQLObjectType({
  name: "MutualGuildType",
  fields: () => ({
    excluded: { type: new GraphQLList(GuildType) },
    included: { type: new GraphQLList(GuildType) },
  }),
});

const SettingsType = new GraphQLObjectType({
  name: "SettingsType",
  fields: () => ({
    prefix: { type: GraphQLString },
  }),
});

const GuildConfigType = new GraphQLObjectType({
  name: "GuildConfigType",
  fields: () => ({
    guild: { type: GraphQLString },
    settings: { type: SettingsType },
    defaultRole: { type: GraphQLString },
    memberLogChannel: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    getUser: {
      type: UserType,
      resolve(parent, args, request) {
        return request.user ? request.user : null;
      },
    },
    getMutualGuilds: {
      type: MutualGuildType,
      async resolve(parent, args, request) {
        if (request.user) {
          const botGuilds = await getBotGuilds();
          const userGuilds = await getUserGuilds(request.user.discordId);
          return getMutualGuilds(userGuilds, botGuilds);
        }
        return null;
      },
    },
    getGuildConfig: {
      type: GuildConfigType,
      args: {
        guildId: { type: GraphQLString },
      },
      async resolve(parent, args, request) {
        const { guildId } = args;
        if (!guildId || !request.user) return null;
        const config = await GuildConfig.findOne({ guild: guildId });
        return config ? config : null;
      },
    },
  },
});

module.exports = new GraphQLSchema({ query: RootQuery });
