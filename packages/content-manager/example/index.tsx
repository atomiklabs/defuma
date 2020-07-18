import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ContentManager } from '../.';

if (
  typeof process.env.BUCKETS_USER_API_KEY === 'undefined' ||
  process.env.BUCKETS_USER_API_KEY.length === 0
) {
  console.log(process.env)
  throw Error('Missing BUCKETS_USER_API_KEY variable');
}

const props = {
  bucketName: 'my-products',
  userApiKey: process.env.BUCKETS_USER_API_KEY,
  userApiSecret: process.env.BUCKETS_USER_API_SECRET || '',
};

function App() {
  return <ContentManager {...props} />;
}

ReactDOM.render(<App />, document.getElementById('root'));
