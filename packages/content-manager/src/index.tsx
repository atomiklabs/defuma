import React, { useEffect, useState } from 'react';
import {
  getIdentity,
  Identity,
  createDevClient,
  getBucketLinks,
  BucketsClient,
  LinksObject,
  getBucketKey,
} from './buckets';

interface ContentManagerProps {
  bucketName: string;
  userApiKey: string;
  userApiSecret: string;
}

export function ContentManager({
  bucketName,
  userApiKey,
  userApiSecret,
}: ContentManagerProps) {
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [buckets, setBuckets] = useState<BucketsClient | null>(null);
  const [bucketKey, setBucketKey] = useState<string | null>(null);
  const [bucketLinks, setBucketLinks] = useState<LinksObject | null>(null);

  useEffect(() => {
    getIdentity().then(setIdentity);
  }, []);

  useEffect(() => {
    createDevClient({
      key: userApiKey,
      secret: userApiSecret,
    }).then(setBuckets);
  }, [userApiKey, userApiSecret, identity]);

  useEffect(() => {
    if (buckets && bucketName && identity) {
      getBucketKey(buckets, bucketName, identity).then(setBucketKey);
    }
  }, [buckets, bucketName, identity]);

  useEffect(() => {
    if (buckets && bucketKey) {
      getBucketLinks(buckets, bucketKey).then(setBucketLinks);
    }
  }, [buckets, bucketKey]);

  console.log({ identity, buckets, bucketKey, bucketLinks });

  return (
    <div>
      <h1>Content manager</h1>
      {bucketLinks !== null ? (
        <ul>
          {Object.entries(bucketLinks).map(([linkType, link], idx) => (
            <li key={idx}>
              {linkType}:{' '}
              <a href={link} target="_blank">
                {link}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No links to display, mate</p>
      )}
    </div>
  );
}
