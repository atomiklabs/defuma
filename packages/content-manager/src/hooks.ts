import { useEffect, useState } from 'react';
import {
  getIdentity,
  Identity,
  createDevClient,
  getBucketLinks,
  BucketsClient,
  LinksObject,
  getBucketKey,
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
    if (buckets && bucketKey) {
      getBucketLinks(buckets, bucketKey)
        .then(setBucketLinks)
        .catch(() => setBucketLinks(null));
    }
  }, [buckets, bucketKey]);

  return {
    isLoading,
    identity,
    buckets,
    bucketKey,
    bucketLinks,
  };
}
