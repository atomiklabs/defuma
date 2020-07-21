import React, { FC, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import { ethers } from 'ethers'
import useSWR, { SWRConfig } from 'swr'
import { ethFetcher } from 'ether-swr'
import DefumaABI from '../contracts/Defuma.abi'
import DefumaABIAddress from '../contracts/Defuma.address'

// export const ethFetcher = (library, ABIs?) => (...args) => {
//   const [arg1, arg2, ...params] = args
//   console.log(args)
//   // it's a contract
//   if (ethers.utils.isAddress(arg1)) {
//     if (!ABIs) throw new Error(`ABI repo not found`)
//     if (!ABIs.get) throw new Error(`ABI repo isn't a Map`)
//     const address = arg1
//     const method = arg2
//     const abi = ABIs.get(address)
//     if (!abi) throw new Error(`ABI not found for ${address}`)
//     const contract = new ethers.Contract(address, abi, library.getSigner())

//     console.log(contract.providersCount())
//     // console.log(contract[method]())
//     return contract[method](...params)
//   }
//   // it's a eth call
//   const method = arg1
//   return library[method](arg2, ...params)
// }

const ABIs = [[DefumaABIAddress, DefumaABI]]

export const injectedConnector = new InjectedConnector({})

// App
export const Publisher: FC = () => {
  const { library, activate } = useWeb3React<any>()

  useEffect(() => {
    activate(injectedConnector)
  }, [])

  return (
    <SWRConfig value={{ fetcher: ethFetcher(library, new Map(ABIs as any)) }}>
      <Wallet />
    </SWRConfig>
  )
}

// Wallet
export const Wallet = () => {
  const { chainId, account, active } = useWeb3React<any>()

  return (
    <div>
      <div>ChainId: {chainId}</div>
      <div>Account: {account}</div>
      {active && <Balance />}
      {active && <Defuma />}
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

// Defuma SC
export const Defuma = () => {
  const { account, library } = useWeb3React()

  const { data: providersCount } = useSWR([DefumaABIAddress, 'providersCount'])

  useEffect(() => {
    // const contract = new ethers.Contract(DefumaABIAddress, ERC20ABI, library.getSigner())
    // const fromMe = contract.filters.Transfer(account, null)
    // library.on(fromMe, (from, to, amount, event) => {
    //   console.log('Transfer|sent', { from, to, amount, event })
    //   mutate(undefined, true)
    // })
    // const toMe = contract.filters.Transfer(null, account)
    // library.on(toMe, (from, to, amount, event) => {
    //   console.log('Transfer|received', { from, to, amount, event })
    //   mutate(undefined, true)
    // })
    // return () => {
    //   library.removeAllListeners(toMe)
    //   library.removeAllListeners(fromMe)
    // }
  }, [])

  return (
    <div>
      {providersCount && <p>providersCount: {providersCount.toString()}</p>}
      {/* Add Provider */}
      {/* Add Provider Data */}
    </div>
  )
}
