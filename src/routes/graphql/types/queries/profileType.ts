import { GraphQLObjectType, GraphQLNonNull, GraphQLBoolean, GraphQLInt } from 'graphql';
import { UUIDType } from '../uuid.js';
import { MemberType } from './memberType.js';

export const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  description: 'Represents a user profile containing demographic and membership data.',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(UUIDType),
      description: 'Unique identifier of the profile',
    },
    isMale: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'Gender flag (true for male, false for female/other)',
    },
    yearOfBirth: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'Birth year of the profile owner',
    },
    memberType: {
      type: new GraphQLNonNull(MemberType),
      description: 'Membership tier information',
      resolve: async (
        parent: { memberTypeId?: string },
        _args: unknown,
        context: { prisma: any }, // better to define Prisma type if available
      ) => {
        if (!parent.memberTypeId) return null;
        return context.prisma.memberType.findUnique({
          where: { id: parent.memberTypeId },
        });
      },
    },
  }),
});
