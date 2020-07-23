import React, { FC, useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import useSWR from 'swr'
import { ABI_DEFUMA } from '../config'

export const Defuma: FC = () => {
  const { library } = useWeb3React()
  const { data: providersCountBN, mutate } = useSWR([ABI_DEFUMA.address, 'providersCount'])
  const providersCount = providersCountBN && providersCountBN.toNumber()

  const [providerName, setProviderName] = useState('')
  const [providers, setProviders] = useState([])

  const defumaContract = new ethers.Contract(ABI_DEFUMA.address, ABI_DEFUMA.abi as any, library.getSigner())

  useEffect(() => {
    const providerEvent = defumaContract.filters.Provider()
    library.on(providerEvent, (e) => {
      console.log("Emitting 'Provider'")
    })

    return () => {
      library.removeAllListeners(providerEvent)
    }
  }, [])

  useEffect(() => {
    if (providersCount) {
      fetchProviders()
    }
  }, [providersCount])

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
