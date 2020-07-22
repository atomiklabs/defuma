import React from 'react'
import ReactDOM from 'react-dom'
import { Web3ReactProvider } from '@web3-react/core'
import { ethers } from 'ethers'
import { Publisher } from './publisher'

const Web3Provider = ethers.providers.Web3Provider

function getLibrary(provider: any): any {
  const library = new Web3Provider(provider)
  // library.pollingInterval = 12000
  return library
}

ReactDOM.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      {/* <Router> <Publisher/><Advertiser/> </Router */}
      <Publisher />
    </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
