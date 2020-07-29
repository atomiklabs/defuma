import React, { FC } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Balance } from './balance'
import { Defuma } from './defuma'
import { Login } from '../login'

export const Provider: FC = () => {
  const { chainId, account, active } = useWeb3React()

  if (!active) return <h3>Loading...</h3>
  return (
    <div>
      <Login />
      <p>ChainId: {chainId}</p>
      <p>Account: {account}</p>
      <Balance />
      <Defuma />
    </div>
  )
}
