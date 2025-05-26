import { FastifyRequest } from 'fastify';
import { createDataLoaders } from './DataLoaders.js';
export function createContext(req: FastifyRequest, fastify) {
  const prisma = fastify.prisma;
  const loaders = createDataLoaders(prisma);
  return {
    prisma,
    loaders,
    fastify,
  };
}
