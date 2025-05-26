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


const createMutation = (
  type,
  inputType,
  prismaModel,
  loaderKey?: string,
  loaderPrimeKey: string = 'id',
) => ({
  type: new GraphQLNonNull(type),
  args: {
    dto: { type: new GraphQLNonNull(inputType) },
  },
  resolve: async (_parent, { dto }, context) => {
    const result = await context.prisma[prismaModel].create({ data: dto });
    if (loaderKey) {
      context.loaders[loaderKey].prime(result[loaderPrimeKey], result);
    }
    return result;
  },
});


const updateMutation = (
  type,
  inputType,
  prismaModel,
  loaderKey?: string,
  loaderPrimeKey: string = 'id',
) => ({
  type: new GraphQLNonNull(type),
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
    dto: { type: new GraphQLNonNull(inputType) },
  },
  resolve: async (_parent, { id, dto }, context) => {
    const result = await context.prisma[prismaModel].update({
      where: { id },
      data: dto,
    });
    if (loaderKey) {
      const key = loaderPrimeKey === 'id' ? id : result[loaderPrimeKey];
      context.loaders[loaderKey].clear(key).prime(key, result);
    }
    return result;
  },
});


const deleteMutation = (model: string, loaderKey?: string) => ({
  type: new GraphQLNonNull(GraphQLString),
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: async (_parent, { id }, context) => {
    await context.prisma[model].delete({ where: { id } });
    if (loaderKey) context.loaders[loaderKey].clear(id);
    return `${model.charAt(0).toUpperCase() + model.slice(1)} ${id} deleted successfully.`;
  },
});

export const MutationType = new GraphQLObjectType({
  name: 'Mutations',
  fields: {
    createUser: createMutation(UserType, CreateUserInputType, 'user', 'userLoader'),
    createProfile: createMutation(
      ProfileType,
      CreateProfileInputType,
      'profile',
      'profileLoader',
    ),
    createPost: {
      type: new GraphQLNonNull(PostType),
      args: {
        dto: { type: new GraphQLNonNull(CreatePostInputType) },
      },
      resolve: async (_parent, { dto }, context) => {
        const post = await context.prisma.post.create({ data: dto });
        context.loaders.postsByAuthorIdLoader.clear(dto.authorId);
        return post;
      },
    },

    changeUser: updateMutation(UserType, ChangeUserInputType, 'user', 'userLoader'),
    changeProfile: updateMutation(
      ProfileType,
      ChangeProfileInputType,
      'profile',
      'profileLoader',
      'userId',
    ),
    changePost: updateMutation(PostType, ChangePostInputType, 'post', 'postLoader'),

    deleteUser: deleteMutation('user', 'userLoader'),
    deleteProfile: deleteMutation('profile', 'profileLoader'),
    deletePost: deleteMutation('post'), 

    subscribeTo: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_parent, { userId, authorId }, context) => {
        await context.prisma.subscribersOnAuthors.create({
          data: {
            subscriberId: userId,
            authorId: authorId,
          },
        });
        context.loaders.userSubscribedToLoader.clear(userId);
        context.loaders.subscribedToUserLoader.clear(authorId);
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
        await context.prisma.subscribersOnAuthors.delete({
          where: {
            subscriberId_authorId: {
              subscriberId: userId,
              authorId: authorId,
            },
          },
        });
        context.loaders.userSubscribedToLoader.clear(userId);
        context.loaders.subscribedToUserLoader.clear(authorId);
        return 'Unsubscribed successfully.';
      },
    },
  },
});
