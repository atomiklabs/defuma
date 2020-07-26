import React from 'react'
import ReactDOM from 'react-dom'
import { Main } from './main'
import { ContentManager } from '@atomiklabs/content-manager'

ReactDOM.render(
  <React.StrictMode>
    <ContentManager userApiKey="bxikmslquguiw6zcmmcm7glzvtm" userApiSecret="" bucketName="files-miki" />
    <Main />
  </React.StrictMode>,
  document.getElementById('root')
)
