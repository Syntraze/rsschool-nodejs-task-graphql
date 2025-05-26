import {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLInt,
} from 'graphql';
import { UUIDType } from '../uuid.js';
import { MemberTypeIdEnum } from './memberType.js';

import { GraphQLInputType } from 'graphql';

const field = (type: GraphQLInputType, isRequired = false): { type: GraphQLInputType } => ({
  type: isRequired ? new GraphQLNonNull(type) : type,
});


export const ChangeUserInputType = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: field(GraphQLString),
    balance: field(GraphQLFloat),
  },
});

export const ChangeProfileInputType = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: {
    isMale: field(GraphQLBoolean),
    yearOfBirth: field(GraphQLInt),
    memberTypeId: field(MemberTypeIdEnum),
  },
});

export const ChangePostInputType = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: {
    title: field(GraphQLString),
    content: field(GraphQLString),
  },
});

export const CreateUserInputType = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: field(GraphQLString, true),
    balance: field(GraphQLFloat, true),
  },
});

export const CreateProfileInputType = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: {
    isMale: field(GraphQLBoolean, true),
    yearOfBirth: field(GraphQLInt, true),
    userId: field(UUIDType, true),
    memberTypeId: field(MemberTypeIdEnum, true),
  },
});

export const CreatePostInputType = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: {
    title: field(GraphQLString, true),
    content: field(GraphQLString, true),
    authorId: field(UUIDType, true),
  },
});
