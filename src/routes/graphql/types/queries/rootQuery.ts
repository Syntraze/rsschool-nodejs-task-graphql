import { GraphQLObjectType, GraphQLList, GraphQLNonNull } from 'graphql';
import { UserType } from './userType.js';
import { PostType } from './postType.js';
import { ProfileType } from './profileType.js';
import { MemberType } from './memberType.js';
import { UUIDType } from '../uuid.js';
import { MemberTypeIdEnum } from './memberType.js';
import type { PrismaClient } from '@prisma/client';

// Typings for context & args
interface Context {
  prisma: PrismaClient;
}

interface UsersArgs {}

interface MemberTypeArgs {
  id: string;
}

interface UserArgs {
  id: string;
}

interface PostArgs {
  id: string;
}

interface ProfileArgs {
  id: string;
}

export const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberType))),
      resolve: async (_parent: unknown, _args: unknown, context: Context) => {
        try {
          return await context.prisma.memberType.findMany();
        } catch (error) {
          console.error('Error fetching memberTypes:', error);
          throw error;
        }
      },
    },
    memberType: {
      type: MemberType,
      args: {
        id: { type: new GraphQLNonNull(MemberTypeIdEnum) },
      },
      resolve: async (_parent: unknown, args: MemberTypeArgs, context: Context) => {
        return context.prisma.memberType.findUnique({ where: { id: args.id } });
      },
    },
    users: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (_parent, _args: UsersArgs, context: Context) => {
        // Optionally, you can still dynamically include relations based on your needs
        return context.prisma.user.findMany({
          include: {
            profile: true,
            posts: true,
            userSubscribedTo: true,
            subscribedToUser: true,
          },
        });
      },
    },
    user: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_parent, args: UserArgs, context: Context) => {
        return context.prisma.user.findUnique({ where: { id: args.id } });
      },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      resolve: async (_parent, _args, context: Context) => {
        return context.prisma.post.findMany();
      },
    },
    post: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_parent, args: PostArgs, context: Context) => {
        return context.prisma.post.findUnique({ where: { id: args.id } });
      },
    },
    profiles: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ProfileType))),
      resolve: async (_parent, _args, context: Context) => {
        return context.prisma.profile.findMany();
      },
    },
    profile: {
      type: ProfileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_parent, args: ProfileArgs, context: Context) => {
        return context.prisma.profile.findUnique({ where: { id: args.id } });
      },
    },
  },
});
