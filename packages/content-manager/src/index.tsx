import React from 'react';
import { useBuckets } from './hooks';
import { LinksObject, BucketIndex } from './buckets';

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
  const hookData = useBuckets({ userApiKey, userApiSecret, bucketName });

  return (
    <Wrapper>
      {hookData.identity != null && (
        <h2>ID: {hookData.identity.public.toString().substr(-7, 7)}</h2>
      )}
      {typeof hookData.bucketLinks !== 'undefined' && (
        <ListOfLinks bucketLinks={hookData.bucketLinks} />
      )}
      {typeof hookData.bucketIndex !== 'undefined' && (
        <BucketIndexView {...hookData.bucketIndex} />
      )}
      {hookData.isLoading && <p>Loading data...</p>}
    </Wrapper>
  );
}

interface WrapperProps extends React.PropsWithChildren<{}> {}
function Wrapper({ children }: WrapperProps) {
  return (
    <div>
      <h1>Content manager</h1>
      {children}
    </div>
  );
}

interface ListOfLinksProps {
  bucketLinks: LinksObject | null;
}
function ListOfLinks({ bucketLinks }: ListOfLinksProps) {
  const links = bucketLinks !== null ? Object.entries(bucketLinks) : [];

  if (links.length === 0) {
    return <p>No links to display, mate</p>;
  }

  return (
    <ul>
      {links.map(([linkType, link], idx) => (
        <li key={idx}>
          {linkType}:{' '}
          <a href={link} target="_blank">
            {link}
          </a>
        </li>
      ))}
    </ul>
  );
}

interface BucketIndexViewProps extends BucketIndex {}

function BucketIndexView({ author, createdAt, paths }: BucketIndexViewProps) {
  return (
    <section>
      <header>
        Summary: created by <strong>{author}</strong> on{' '}
        <time>{new Date(createdAt).toLocaleString()}</time>
      </header>
      {paths.length === 0 && <p>Bucket is empty.</p>}
      {paths.length !== 0 && (
        <ul>
          {paths.map(path => (
            <li key={path}>{path}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
