import { FastifyRequest } from 'fastify';
import { createDataLoaders } from '../DataLoaders.js';

export function mapById(items, key = 'id') {
  const map = new Map();
  for (const item of items) {
    map.set(item[key], item);
  }
  return map;
}

export function groupBy(items, key) {
  return items.reduce((acc, item) => {
    const groupKey = item[key];
    if (!acc.has(groupKey)) {
      acc.set(groupKey, []);
    }
    acc.get(groupKey).push(item);
    return acc;
  }, new Map());
}
export const handleError = (error, message) => {
  console.error(message, error);
  throw new Error(message);
};

export function createContext(req: FastifyRequest, fastify) {
  const prisma = fastify.prisma;
  const loaders = createDataLoaders(prisma);
  return {
    prisma,
    loaders,
    fastify,
  };
}
