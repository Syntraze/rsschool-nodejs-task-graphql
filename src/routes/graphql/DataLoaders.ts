

import DataLoader from 'dataloader';
import { mapById, groupBy } from './types/utils.js';

export function createDataLoaders(prisma) {
  return {
    userLoader: new DataLoader(async (ids) => {
      const users = await prisma.user.findMany({
        where: { id: { in: ids } },
      });
      const userMap = mapById(users);
      return ids.map((id) => userMap.get(id));
    }),

    profileLoader: new DataLoader(async (userIds) => {
      const profiles = await prisma.profile.findMany({
        where: { userId: { in: userIds } },
      });
      const profileMap = mapById(profiles, 'userId');
      return userIds.map((id) => profileMap.get(id));
    }),

    postsByAuthorIdLoader: new DataLoader(async (authorIds) => {
      const posts = await prisma.post.findMany({
        where: { authorId: { in: authorIds } },
      });
      const postsMap = groupBy(posts, 'authorId');
      return authorIds.map((id) => postsMap.get(id) || []);
    }),

    userSubscribedToLoader: new DataLoader(async (userIds) => {
      const subscriptions = await prisma.subscribersOnAuthors.findMany({
        where: { subscriberId: { in: userIds } },
        include: { author: true },
      });
      const subMap = groupBy(subscriptions, 'subscriberId');
      return userIds.map((id) => (subMap.get(id) || []).map((sub) => sub.author));
    }),

    subscribedToUserLoader: new DataLoader(async (userIds) => {
      const subscribers = await prisma.subscribersOnAuthors.findMany({
        where: { authorId: { in: userIds } },
        include: { subscriber: true },
      });
      const subMap = groupBy(subscribers, 'authorId');
      return userIds.map((id) => (subMap.get(id) || []).map((sub) => sub.subscriber));
    }),

    memberTypeLoader: new DataLoader(async (ids) => {
      const memberTypes = await prisma.memberType.findMany({
        where: { id: { in: ids } },
      });
      const memberTypeMap = mapById(memberTypes);
      return ids.map((id) => memberTypeMap.get(id));
    }),

    postLoader: new DataLoader(async (ids) => {
      const posts = await prisma.post.findMany({
        where: { id: { in: ids } },
      });
      const postMap = mapById(posts);
      return ids.map((id) => postMap.get(id));
    }),
  };
}
