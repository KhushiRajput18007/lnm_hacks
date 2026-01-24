import { MiniAppNotificationDetails } from "@farcaster/miniapp-sdk";
import { Redis } from "@upstash/redis";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

let redis: Redis | null = null;
const memoryStore = new Map<string, any>();

if (redisUrl && redisToken) {
  redis = new Redis({
    url: redisUrl,
    token: redisToken,
  });
} else {
  console.warn("Redis credentials not found, using in-memory store.");
}

function getUserNotificationDetailsKey(fid: number): string {
  return `${fid}`;
}

export async function getUserNotificationDetails(
  fid: number
): Promise<MiniAppNotificationDetails | null> {
  if (redis) {
    return await redis.get<MiniAppNotificationDetails>(
      getUserNotificationDetailsKey(fid)
    );
  }
  return memoryStore.get(getUserNotificationDetailsKey(fid)) || null;
}

export async function setUserNotificationDetails(
  fid: number,
  notificationDetails: MiniAppNotificationDetails
): Promise<void> {
  if (redis) {
    await redis.set(getUserNotificationDetailsKey(fid), notificationDetails);
    return;
  }
  memoryStore.set(getUserNotificationDetailsKey(fid), notificationDetails);
}

export async function deleteUserNotificationDetails(
  fid: number
): Promise<void> {
  if (redis) {
    await redis.del(getUserNotificationDetailsKey(fid));
    return;
  }
  memoryStore.delete(getUserNotificationDetailsKey(fid));
}