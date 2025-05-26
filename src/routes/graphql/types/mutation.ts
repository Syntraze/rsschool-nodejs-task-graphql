import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';

import {
  CreateUserInputType,
  CreatePostInputType,
  CreateProfileInputType,
  ChangePostInputType,
  ChangeProfileInputType,
  ChangeUserInputType,
} from './queries/inputType.js';
import { UUIDType } from './uuid.js';
import { PostType } from './queries/postType.js';
import { ProfileType } from './queries/profileType.js';
import { UserType } from './queries/userType.js';

export const MutationType = new GraphQLObjectType({
  name: 'Mutations',
  fields: {
    createUser: {
      type: new GraphQLNonNull(UserType),
      args: {
        dto: { type: new GraphQLNonNull(CreateUserInputType) },
      },
      resolve: async (_parent, { dto }, context) => {
        return context.prisma.user.create({ data: dto });
      },
    },

    createProfile: {
      type: new GraphQLNonNull(ProfileType),
      args: {
        dto: { type: new GraphQLNonNull(CreateProfileInputType) },
      },
      resolve: async (_parent, { dto }, context) => {
        return context.prisma.profile.create({ data: dto });
      },
    },

    createPost: {
      type: new GraphQLNonNull(PostType),
      args: {
        dto: { type: new GraphQLNonNull(CreatePostInputType) },
      },
      resolve: async (_parent, { dto }, context) => {
        return context.prisma.post.create({ data: dto });
      },
    },

    changeUser: {
      type: new GraphQLNonNull(UserType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeUserInputType) },
      },
      resolve: async (_parent, { id, dto }, context) => {
        return context.prisma.user.update({
          where: { id },
          data: dto,
        });
      },
    },

    changeProfile: {
      type: new GraphQLNonNull(ProfileType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeProfileInputType) },
      },
      resolve: async (_parent, { id, dto }, context) => {
        return context.prisma.profile.update({
          where: { id },
          data: dto,
        });
      },
    },

    changePost: {
      type: new GraphQLNonNull(PostType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangePostInputType) },
      },
      resolve: async (_parent, { id, dto }, context) => {
        return context.prisma.post.update({
          where: { id },
          data: dto,
        });
      },
    },

    deleteUser: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_parent, { id }, context) => {
        await context.prisma.user.delete({ where: { id } });
        return `User ${id} deleted successfully.`;
      },
    },

    deleteProfile: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_parent, { id }, context) => {
        await context.prisma.profile.delete({ where: { id } });
        return `Profile ${id} deleted successfully.`;
      },
    },

    deletePost: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_parent, { id }, context) => {
        await context.prisma.post.delete({ where: { id } });
        return `Post ${id} deleted successfully.`;
      },
    },

    subscribeTo: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_parent, { userId, authorId }, context) => {
        await context.prisma.subscription.create({
          data: {
            subscriberId: userId,
            authorId,
          },
        });
        return 'Subscribed successfully.';
      },
    },

    unsubscribeFrom: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_parent, { userId, authorId }, context) => {
        await context.prisma.subscription.delete({
          where: {
            subscriberId_authorId: {
              subscriberId: userId,
              authorId,
            },
          },
        });
        return 'Unsubscribed successfully.';
      },
    },
  },
});
