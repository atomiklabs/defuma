import React, { useState, FormEvent } from 'react';
import { useBuckets } from './hooks';
import { LinksObject, BucketIndex } from './buckets';

interface ContentManagerProps {
  bucketName: string;
  userApiKey: string;
  userApiSecret: string;
}

interface FileObject {
  name: string;
  contents: string;
}

export function ContentManager({
  bucketName,
  userApiKey,
  userApiSecret,
}: ContentManagerProps) {
  const hookData = useBuckets({ userApiKey, userApiSecret, bucketName });

  const [fileBeingEdited, setFileBeingEdited] = useState<FileObject | null>(
    null
  );

  function createItem() {
    console.log('about to create item');

    setFileBeingEdited({
      name: `${Date.now()}-new-file.json`,
      contents: '',
    });
  }

  function editItem(path: string) {
    console.log('about to edit item under a path', path);
  }

  function storeFileChanges(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    // @ts-ignore
    console.log('form entries', [...(formData.entries())])

  }

  function cancelFileChanges(event: FormEvent<HTMLFormElement>) {
    console.log(new FormData(event.currentTarget))
    setFileBeingEdited(null)
  }

  return (
    <Wrapper>
      {hookData.identity != null && (
        <h2>ID: {hookData.identity.public.toString().substr(-7, 7)}</h2>
      )}
      {typeof hookData.bucketLinks !== 'undefined' && (
        <ListOfLinks bucketLinks={hookData.bucketLinks} />
      )}
      {typeof hookData.bucketIndex !== 'undefined' && (
        <BucketIndexView
          {...hookData.bucketIndex}
          editItem={editItem}
          createItem={createItem}
        />
      )}
      {hookData.isLoading && <p>Loading data...</p>}
      {fileBeingEdited != null && (
        <form onSubmit={storeFileChanges} onReset={cancelFileChanges}>
          <label htmlFor="file-name">File name</label>
          <input type="text" name="file-name" defaultValue={fileBeingEdited.name} />
          <label htmlFor="file-contents">File name</label>
          <textarea rows={10} cols={10} name="file-contents" defaultValue={fileBeingEdited.contents} />
          <button type="submit">Save</button>
          <button type="reset">Cancel</button>
        </form>
      )}
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

interface BucketIndexViewProps extends BucketIndex {
  editItem: (path: string) => void;
  createItem: () => void;
}

function BucketIndexView({
  author,
  createdAt,
  paths,
  editItem,
  createItem,
}: BucketIndexViewProps) {
  return (
    <section>
      <header>
        Summary: created by <strong>{author}</strong> on{' '}
        <time>{new Date(createdAt).toLocaleString()}</time>
      </header>
      <>
        <h2>Bucket index view</h2>
        <button type="button" onClick={() => createItem()}>
          New item
        </button>

        {paths.length === 0 && <p>Bucket is empty.</p>}
        {paths.length !== 0 && (
          <ul>
            {paths.map(path => (
              <li key={path}>
                {path}{' '}
                <button type="button" onClick={() => editItem(path)}>
                  Edit
                </button>
              </li>
            ))}
          </ul>
        )}
      </>
    </section>
  );
}
