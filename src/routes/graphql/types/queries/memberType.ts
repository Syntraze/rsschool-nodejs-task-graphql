import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLFloat,
  GraphQLInt,
  GraphQLEnumType,
} from 'graphql';

export const MemberTypeIdEnum = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    BASIC: { value: 'BASIC' },
    BUSINESS: { value: 'BUSINESS' },
  },
});


export const MemberType = new GraphQLObjectType({
  name: 'MemberType',
  description: 'Defines the properties of different membership tiers.',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(MemberTypeIdEnum),
      description: 'Unique ID for the member type',
    },
    discount: {
      type: new GraphQLNonNull(GraphQLFloat),
      description: 'Discount percentage (e.g., 0.1 for 10%)',
    },
    postsLimitPerMonth: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'Number of posts allowed per month for this member type',
    },
  }),
});
