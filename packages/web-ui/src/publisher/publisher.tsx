import React, { FC, useState } from 'react'
import { ethers } from 'ethers'
import { Account } from './core/account'
import { useExchangePrice } from './hooks'
import './publisher.scss'

export const Publisher: FC = () => {
  // const [address, setAddress] = useState()
  // const localProvider = new ethers.providers.JsonRpcProvider(
  //   process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : 'http://localhost:8545'
  // )
  // const mainnetProvider = new ethers.providers.InfuraProvider('mainnet', '2717afb6bf164045b5d5468031b93f87')
  // const price = useExchangePrice(mainnetProvider)
  // const [injectedProvider, setInjectedProvider] = useState()

  return (
    <div>
      <div style={{ position: 'fixed', textAlign: 'right', right: 0, top: 0, padding: 10 }}>
        {/* <Account
          address={address}
          setAddress={setAddress}
          localProvider={localProvider}
          injectedProvider={injectedProvider}
          setInjectedProvider={setInjectedProvider}
          mainnetProvider={mainnetProvider}
          price={price}
        /> */}
      </div>
      Continue with importing provider's json ....
    </div>
  )
}
