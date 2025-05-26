import { FastifyRequest } from 'fastify';

export function createContext(req: FastifyRequest, fastify) {
  const prisma = fastify.prisma;

  return {
    prisma,
    fastify,
  };
}
