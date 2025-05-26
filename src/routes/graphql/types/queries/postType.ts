import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import { UUIDType } from '../uuid.js';

export const PostType = new GraphQLObjectType({
  name: 'Post',
  description: 'Represents a blog or forum post authored by a user.',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(UUIDType),
      description: 'Unique identifier for the post',
    },
    title: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Title of the post',
    },
    content: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Full content/body of the post',
    },
  }),
});
