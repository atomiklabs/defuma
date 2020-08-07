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
    library.on(providerEvent, e => {
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

  const handleSubmit = async e => {
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
      <form className="form-inline" onSubmit={handleSubmit}>
        <div className="form-group mx-sm-3 mb-2">
          <label className="mr-2">Product schema:</label>
          <input
            type="text"
            className="form-control"
            placeholder="{ ... }"
            value={providerName}
            onChange={e => setProviderName(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="btn btn-dark mb-2"
        >
          Add Product
        </button>
      </form>

      <div className="card-header">Schemas:</div>
      <ul className="list-group list-group-flush">
        {providers.map((provider, i) => (
          <li key={i} className="list-group-item">
            {provider}
          </li>
        ))}
      </ul>
    </div>
  )
}
