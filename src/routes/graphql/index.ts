import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema, schema } from './schemas.js';
import { graphql, parse, validate, specifiedRules, GraphQLError } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { createContext } from './context.js';

const VALIDATION_RULES = [...specifiedRules, depthLimit(5)];

const formatErrors = (errors: readonly GraphQLError[]) => ({
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
    async handler(req) {
      try {
        const { query, variables } = req.body;

        // Early parse and validation
        const document = parse(query);
        const validationErrors = validate(schema, document, VALIDATION_RULES);
        if (validationErrors.length > 0) {
          return formatErrors(validationErrors);
        }

        const context = await createContext(req, fastify);

        const result = await graphql({
          schema,
          source: query,
          variableValues: variables,
          contextValue: context,
        });

        return result;
      } catch (error: unknown) {
        console.error('GraphQL Execution Error:', error);
        const graphQLErr =
          error instanceof GraphQLError
            ? error
            : new GraphQLError((error as Error).message || 'Internal error');
        return formatErrors([graphQLErr]);
      }
    },
  });
};

export default plugin;
