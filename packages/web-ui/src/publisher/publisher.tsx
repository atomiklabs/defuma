import React, { FC, useEffect } from 'react'
import { ethers } from 'ethers'
import { Web3ReactProvider } from '@web3-react/core'
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import useSWR, { SWRConfig } from 'swr'
import { ethFetcher } from 'ether-swr'

const Web3Provider = ethers.providers.Web3Provider

export const injectedConnector = new InjectedConnector({})

function getLibrary(provider: any): any {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

// Wallet
export const Wallet = () => {
  const { chainId, account, activate, library, active } = useWeb3React<any>()

  useEffect(() => {
    activate(injectedConnector)
  }, [])

  return (
    <div>
      <div>ChainId: {chainId}</div>
      <div>Account: {account}</div>
      {active && (
        <SWRConfig value={{ fetcher: ethFetcher(library) }}>
          <Balance />
        </SWRConfig>
      )}
    </div>
  )
}

// Balance

const formatEther = ethers.utils.formatEther

export const Balance = () => {
  const { account, library } = useWeb3React<any>()
  const { data: balance, mutate } = useSWR(['getBalance', account, 'latest'])

  useEffect(() => {
    console.log('listening for blocks...')
    library.on('block', () => {
      console.log('update balance...')
      mutate(undefined, true)
    })
    return () => {
      library.removeAllListeners('block')
    }
  }, [])

  if (!balance) return <div>...</div>
  return <div>{parseFloat(formatEther(balance)).toPrecision(6)}</div>
}

// App
export const Publisher: FC = () => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Wallet />
    </Web3ReactProvider>
  )
}
