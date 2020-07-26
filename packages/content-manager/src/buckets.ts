import {
  Buckets,
  UserAuth,
  PushPathResult,
  Root,
  KeyInfo,
  LinksReply,
} from '@textile/hub';
import { Libp2pCryptoIdentity } from '@textile/threads-core';

export type BucketsClient = Buckets;

/**
 * Create a Bucket client instance with the same auth
 * methods used for threads
 */
export async function createClient(
  callback: () => Promise<UserAuth>
): Promise<BucketsClient> {
  return Buckets.withUserAuth(callback);
}

/**
 * Create a Bucket client instance in dev mode.
 */
export async function createDevClient(
  keyInfo: KeyInfo
): Promise<BucketsClient> {
  return Buckets.withKeyInfo(keyInfo);
}

export async function run(
  buckets: BucketsClient,
  bucketName: string = 'files'
): Promise<string> {
  /**
   * List existing Buckets
   */
  const existing = await find(buckets, bucketName);

  /**
   * If a Bucket named `bucketName` already existed for this user, use it.
   * If not, create one now.
   */
  let bucketKey = '';
  if (existing) {
    bucketKey = existing.key;
  } else {
    const created = await buckets.init(bucketName);
    bucketKey = created.root ? created.root.key : '';
  }
  return bucketKey;
}

export async function add(
  buckets: BucketsClient,
  webpage: string,
  bucketKey: string
): Promise<PushPathResult> {
  /**
   * Add a simple file Buffer
   *
   * Alternative formats are here: https://github.com/textileio/js-hub/blob/master/src/normalize.ts#L14
   *
   * We add the file as index.html so that we can render it right in the browser afterwards.
   */
  const file = { path: '/index.html', content: Buffer.from(webpage) };

  /**
   * Push the file to the root of the Files Bucket.
   */
  return await buckets.pushPath(bucketKey, 'index.html', file);
}

export type RootObject = Root.AsObject;

export async function find(
  buckets: BucketsClient,
  bucketName: string
): Promise<RootObject | undefined> {
  const roots = await buckets.list();
  return roots.find(bucket => bucket.name === bucketName);
}

export async function exists(
  buckets: BucketsClient,
  bucketName: string
): Promise<boolean> {
  return typeof (await find(buckets, bucketName)) !== 'undefined';
}

export type Identity = Libp2pCryptoIdentity;

export async function getIdentity(): Promise<Identity> {
  /** Restore any cached user identity first */
  const cached = localStorage.getItem('user-private-identity');
  if (cached !== null) {
    /** Convert the cached identity string to a Libp2pCryptoIdentity and return */
    return Libp2pCryptoIdentity.fromString(cached);
  }
  /** No cached identity existed, so create a new one */
  const identity = await Libp2pCryptoIdentity.fromRandom();
  /** Add the string copy to the cache */
  localStorage.setItem('user-private-identity', identity.toString());
  /** Return the random identity */
  return identity;
}

export async function getBucketKey(
  buckets: BucketsClient,
  bucketName: string,
  identity: Identity
): Promise<string | null> {
  try {
    // Authorize the user and your insecure keys with getToken
    await buckets.getToken(identity);

    const bucket = await buckets.open(bucketName);
    if (typeof bucket !== 'undefined') {
      return bucket.key;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }

  return null;
}

export type LinksObject = LinksReply.AsObject;

/**
 * getBucketLinks returns all the protocol endpoints for the bucket.
 * Read more:
 * https://docs.textile.io/hub/buckets/#bucket-protocols
 */
export async function getBucketLinks(
  buckets: Buckets,
  bucketKey: string
): Promise<LinksObject | null> {
  if (!buckets || !bucketKey) {
    console.error('No bucket client or root key');
    return null;
  }

  return await buckets.links(bucketKey);
}

export const indexPath = 'index.json';

export interface BucketIndex {
  author: string;
  createdAt: number;
  paths: string[];
}

export async function getBucketIndex(
  buckets: Buckets,
  bucketKey: string
): Promise<BucketIndex> {
  const indexMetadata = buckets.pullPath(bucketKey, indexPath);
  try {
    console.log('reading index: start');
    const { value } = await indexMetadata.next();
    let str = '';
    for (var i = 0; i < value.length; i++) {
      str += String.fromCharCode(parseInt(value[i]));
    }
    return JSON.parse(str) as BucketIndex;
  } catch (error) {
    console.error('reading index error', error);
    throw error;
  }
}

export async function storeBucketIndex(
  buckets: Buckets,
  bucketKey: string,
  indexState: BucketIndex
) {
  const indexBuffer = Buffer.from(JSON.stringify(indexState, null, 2));
  await buckets.pushPath(bucketKey, indexPath, indexBuffer);
}
