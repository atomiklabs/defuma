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
    console.log('form entries', [...formData.entries()]);
  }

  function cancelFileChanges(event: FormEvent<HTMLFormElement>) {
    console.log(new FormData(event.currentTarget));
    setFileBeingEdited(null);
  }

  return (
    <Wrapper>
      {hookData.identity != null && (
        <h6 className="card-subtitle mb-2 text-muted">
          ID: {hookData.identity.public.toString().substr(-7, 7)}
        </h6>
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
      {hookData.isLoading && <Spinner />}
      {fileBeingEdited != null && (
        <form onSubmit={storeFileChanges} onReset={cancelFileChanges}>
          <div className="form-group">
            <label htmlFor="file-name">File name: </label>
            <input
              type="text"
              className="form-control"
              name="file-name"
              defaultValue={fileBeingEdited.name}
            />
          </div>
          <div className="form-group">
            <label htmlFor="file-contents">File name: </label>
            <textarea
              className="form-control"
              rows={3}
              name="file-contents"
              defaultValue={fileBeingEdited.contents}
            />
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-dark mr-2">
              Save
            </button>
            <button type="reset" className="btn btn-dark">
              Cancel
            </button>
          </div>
        </form>
      )}
    </Wrapper>
  );
}

interface WrapperProps extends React.PropsWithChildren<{}> {}
function Wrapper({ children }: WrapperProps) {
  return (
    <div>
      <h5 className="card-title">Content manager</h5>
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
    <div>
      <div className="card-header">Content links:</div>
      <ul className="list-group list-group-flush">
        {links.map(([linkType, link], idx) => (
          <li className="list-group-item" key={idx}>
            {linkType}:{' '}
            <a href={link} target="_blank">
              {link.substr(0, 50)}...
            </a>
          </li>
        ))}
      </ul>
    </div>
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
        <br />
        <h5>Summary:</h5>
        Created by <code>{author}</code>
        <p>
          on <time>{new Date(createdAt).toLocaleString()}</time>
        </p>
      </header>
      <>
        <br />
        <h5>Bucket index view:</h5>
        <button
          type="button"
          className="btn btn-dark mb-2"
          onClick={() => createItem()}
        >
          New item
        </button>

        {paths.length === 0 && <p>Bucket is empty.</p>}
        {paths.length !== 0 && (
          <ul>
            {paths.map(path => (
              <li key={path}>
                {path}{' '}
                <button
                  className="btn btn-dark mb-2"
                  type="button"
                  onClick={() => editItem(path)}
                >
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

const Spinner = () => (
  <div className="d-flex justify-content-center">
    <div className="spinner-border" role="status">
      <span className="sr-only">Loading...</span>
    </div>
  </div>
);
