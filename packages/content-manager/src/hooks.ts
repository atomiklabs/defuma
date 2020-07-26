import { useEffect, useState } from 'react';
import {
  getIdentity,
  Identity,
  createDevClient,
  getBucketLinks,
  BucketsClient,
  LinksObject,
  getBucketKey,
  getBucketIndex,
  storeBucketIndex,
  BucketIndex
} from './buckets';

interface UseBucketsProps {
  bucketName: string;
  userApiKey: string;
  userApiSecret: string;
}

export function useBuckets({
  userApiKey,
  userApiSecret,
  bucketName,
}: UseBucketsProps) {
  const [identity, setIdentity] = useState<Identity | null | undefined>();
  const [bucketIndex, setBucketIndex] = useState<BucketIndex | undefined>();
  const [buckets, setBuckets] = useState<BucketsClient | null | undefined>();
  const [bucketKey, setBucketKey] = useState<string | null | undefined>();
  const [bucketLinks, setBucketLinks] = useState<
    LinksObject | null | undefined
  >();
  const isLoading = [identity, buckets, bucketKey, bucketLinks].some(
    state => typeof state === 'undefined'
  );

  useEffect(() => {
    getIdentity()
      .then(setIdentity)
      .catch(() => setIdentity(null));
  }, []);

  useEffect(() => {
    createDevClient({
      key: userApiKey,
      secret: userApiSecret,
    })
      .then(setBuckets)
      .catch(() => setBuckets(null));
  }, [userApiKey, userApiSecret, identity]);

  useEffect(() => {
    if (buckets && bucketName && identity) {
      getBucketKey(buckets, bucketName, identity)
        .then(setBucketKey)
        .catch(() => setBucketKey(null));
    }
  }, [buckets, bucketName, identity]);

  useEffect(() => {
    if (buckets && bucketKey && identity) {
      getBucketLinks(buckets, bucketKey)
        .then(setBucketLinks)
        .catch(() => setBucketLinks(null));

      getBucketIndex(buckets, bucketKey)
        .then(setBucketIndex)
        .catch(() => {
          const newBucketIndex: BucketIndex = {
            author: identity.public.toString(),
            createdAt: Date.now(),
            paths: []
          }
          setBucketIndex(newBucketIndex);
          storeBucketIndex(buckets, bucketKey, newBucketIndex)
        })
    }
  }, [buckets, bucketKey, identity]);

  return {
    isLoading,
    identity,
    buckets,
    bucketKey,
    bucketLinks,
    bucketIndex,
  };
}
