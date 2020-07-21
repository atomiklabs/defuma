import React from 'react'
import ReactDOM from 'react-dom'
import { Publisher } from './publisher'

ReactDOM.render(
  <React.StrictMode>
    { /* <Router> <Publisher/><Advertiser/> </Router */ }
    <Publisher />
  </React.StrictMode>,
  document.getElementById('root')
)
