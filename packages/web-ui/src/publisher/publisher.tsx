import React, { FC, useEffect, useState } from 'react'
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

// APP
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

// WALLET
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

// BALANCE
const formatEther = ethers.utils.formatEther

export const Balance = () => {
  const { account, library } = useWeb3React<any>()
  const { data: balance, mutate } = useSWR(['getBalance', account, 'latest'])

  useEffect(() => {
    library.on('block', () => {
      console.log('Update balance')
      mutate()
    })
    return () => {
      library.removeAllListeners('block')
    }
  }, [])

  if (!balance) return <div>...</div>
  return <div>{parseFloat(formatEther(balance)).toPrecision(8)}</div>
}

// DEFUMA SC
export const Defuma = () => {
  const { library } = useWeb3React()
  const { data: providersCountBN, mutate } = useSWR([DefumaABIAddress, 'providersCount'])
  const providersCount = providersCountBN && providersCountBN.toNumber()

  const [providerName, setProviderName] = useState('')
  const [providers, setProviders] = useState([])

  const defumaContract = new ethers.Contract(DefumaABIAddress, DefumaABI as any, library.getSigner())

  useEffect(() => {
    const providerEvent = defumaContract.filters.Provider()
    library.on(providerEvent, (e) => {
      console.log(`Emitting 'Provider'`)
    })

    return () => {
      library.removeAllListeners(providerEvent)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await defumaContract.registerProvider(providerName)
      mutate()
    } catch (err) {
      console.log(err)
    }
  }

  const fetchProviders = async () => {
    const providers = []
    for (let i = 1; i <= providersCount; i++) {
      const providerAddress = await defumaContract.providers(i)
      providers.push(providerAddress)
    }
    setProviders(providers)
  }

  useEffect(() => {
    if (providersCount) {
      fetchProviders()
    }
  }, [providersCount])

  return (
    <div>
      {/* Providers count */}
      {<p>Providers count: {providersCount}</p>}
      {/* Add Provider */}
      <form onSubmit={handleSubmit}>
        <label>
          Provider name:
          <input type="text" value={providerName} onChange={(e) => setProviderName(e.target.value)} />
        </label>
        <input type="submit" value="Submit" />
      </form>
      {/* Display Providers */}
      <p>Providers:</p>
      <ul>
        {providers.map((provider, i) => (
          <li key={i}>{provider}</li>
        ))}
      </ul>
      {/* Add Provider Data */}
    </div>
  )
}
