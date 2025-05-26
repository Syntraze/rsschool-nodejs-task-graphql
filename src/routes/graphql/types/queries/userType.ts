import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLFloat,
  GraphQLList,
} from 'graphql';
import { UUIDType } from '../uuid.js';
import { ProfileType } from './profileType.js';
import { PostType } from './postType.js';

export const UserType = new GraphQLObjectType({
  name: 'User',
  description:
    'Represents a user of the system with associated profile, posts, and subscriptions.',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(UUIDType),
      description: 'Unique identifier of the user',
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Full name of the user',
    },
    balance: {
      type: new GraphQLNonNull(GraphQLFloat),
      description: 'User account balance',
    },
    profile: {
      type: ProfileType,
      description: 'User profile containing demographic and membership info',
      resolve: async (parent, _args, context) => {
        if (!parent) return null;

        if (parent.profile) return parent.profile;
        return context.prisma.profile.findUnique({
          where: { userId: parent.id },
        });
      },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      description: 'List of posts authored by the user',
      resolve: async (parent, _args, context) => {
        if (!parent) return [];
        if (parent.posts) return parent.posts;

        return context.prisma.post.findMany({
          where: { authorId: parent.id },
        });
      },
    },
    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      description: 'Users this user is subscribed to',
      resolve: async (parent, _args, context) => {
        if (!parent) return [];

        const subs = parent.userSubscribedTo;
        if (Array.isArray(subs) && subs.length > 0) {
          const authorIds = subs.map((sub) => sub.authorId);
          return context.prisma.user.findMany({
            where: { id: { in: authorIds } },
          });
        }

        const subscriptions = await context.prisma.subscription.findMany({
          where: { subscriberId: parent.id },
        });

        const authorIds = subscriptions.map((sub) => sub.authorId);
        if (authorIds.length === 0) return [];
        return context.prisma.user.findMany({
          where: { id: { in: authorIds } },
        });
      },
    },
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      description: 'Users who are subscribed to this user',
      resolve: async (parent, _args, context) => {
        if (!parent) return [];

        const subs = parent.subscribedToUser;
        if (Array.isArray(subs) && subs.length > 0) {
          const subscriberIds = subs.map((sub) => sub.subscriberId);
          return context.prisma.user.findMany({
            where: { id: { in: subscriberIds } },
          });
        }

        const subscriptions = await context.prisma.subscription.findMany({
          where: { authorId: parent.id },
        });

        const subscriberIds = subscriptions.map((sub) => sub.subscriberId);
        if (subscriberIds.length === 0) return [];
        return context.prisma.user.findMany({
          where: { id: { in: subscriberIds } },
        });
      },
    },
  }),
});
