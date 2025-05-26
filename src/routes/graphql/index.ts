import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import {
  createGqlResponseSchema,
  gqlResponseSchema,
  schema as gqlSchema,
} from './schemas.js';
import { graphql, parse, validate, specifiedRules, GraphQLError } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { createContext } from './types/utils.js';


const GRAPHQL_RULES = [...specifiedRules, depthLimit(5)];

const formatGraphQLErrors = (errors: readonly GraphQLError[]) => ({
  errors: errors.map((error) =>
    error instanceof GraphQLError ? error : new GraphQLError(String(error)),
  ),
});

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.route({
    method: 'POST',
    url: '/',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(request) {
      try {
        const { query, variables } = request.body;

    
        const parsedQuery = parse(query);

  
        const validationErrors = validate(gqlSchema, parsedQuery, GRAPHQL_RULES);
        if (validationErrors.length > 0) {
          return formatGraphQLErrors(validationErrors);
        }


        const context = createContext(request, fastify);

      
        const executionResult = await graphql({
          schema: gqlSchema,
          source: query,
          variableValues: variables,
          contextValue: context,
        });

        return executionResult;
      } catch (error: unknown) {
        console.error('GraphQL Execution Error:', error);
        const graphQLError =
          error instanceof GraphQLError
            ? error
            : new GraphQLError((error as Error).message || 'Internal server error');
        return formatGraphQLErrors([graphQLError]);
      }
    },
  });
};

export default plugin;
