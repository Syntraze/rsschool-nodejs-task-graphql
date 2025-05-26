import { GraphQLObjectType, GraphQLList, GraphQLNonNull } from 'graphql';
import { UserType } from './userType.js';
import { PostType } from './postType.js';
import { ProfileType } from './profileType.js';
import { MemberType } from './memberType.js';
import { UUIDType } from '../uuid.js';
import { MemberTypeIdEnum } from './memberType.js';
import { parseResolveInfo } from 'graphql-parse-resolve-info';
import { handleError } from '../utils.js';


export const QueryType = new GraphQLObjectType({
  name: 'QueryType',
  fields: () => ({
    memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberType))),
      resolve: async (_parent, _args, context) => {
        try {
          return await context.prisma.memberType.findMany();
        } catch (error) {
          handleError(error, 'Failed to fetch member types.');
        }
      },
    },

    memberType: {
      type: MemberType,
      args: {
        id: { type: new GraphQLNonNull(MemberTypeIdEnum) },
      },
      resolve: async (_parent, { id }, context) => {
        try {
          return await context.prisma.memberType.findUnique({ where: { id } });
        } catch (error) {
          handleError(error, 'Failed to fetch member type.');
        }
      },
    },

    users: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (_parent, _args, context, info) => {
        try {
          const parsedInfo = parseResolveInfo(info);
          const fields = parsedInfo?.fieldsByTypeName?.User;
          const include = fields
            ? ['profile', 'posts', 'userSubscribedTo', 'subscribedToUser'].reduce(
                (acc, key) => {
                  if (fields[key]) acc[key] = true;
                  return acc;
                },
                {},
              )
            : undefined;

          const users = await context.prisma.user.findMany({ include });
          users.forEach((user) => context.loaders.userLoader.prime(user.id, user));
          return users;
        } catch (error) {
          handleError(error, 'Failed to fetch users.');
        }
      },
    },

    user: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_parent, { id }, context) => {
        try {
          return await context.prisma.user.findUnique({ where: { id } });
        } catch (error) {
          handleError(error, 'Failed to fetch user.');
        }
      },
    },

    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      resolve: async (_parent, _args, context) => {
        try {
          const posts = await context.prisma.post.findMany();
          posts.forEach((post) => context.loaders.postLoader.prime(post.id, post));
          return posts;
        } catch (error) {
          handleError(error, 'Failed to fetch posts.');
        }
      },
    },

    post: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_parent, { id }, context) => {
        try {
          return await context.prisma.post.findUnique({ where: { id } });
        } catch (error) {
          handleError(error, 'Failed to fetch post.');
        }
      },
    },

    profiles: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ProfileType))),
      resolve: async (_parent, _args, context) => {
        try {
          const profiles = await context.prisma.profile.findMany();
          profiles.forEach((profile) =>
            context.loaders.profileLoader.prime(profile.id, profile),
          );
          return profiles;
        } catch (error) {
          handleError(error, 'Failed to fetch profiles.');
        }
      },
    },

    profile: {
      type: ProfileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_parent, { id }, context) => {
        try {
          return await context.prisma.profile.findUnique({ where: { id } });
        } catch (error) {
          handleError(error, 'Failed to fetch profile.');
        }
      },
    },
  }),
});
