import React, { FC, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import useSWR from 'swr'

export const Balance: FC = () => {
  const { account, library } = useWeb3React()
  const { data: balance, mutate } = useSWR(['getBalance', account, 'latest'])

  useEffect(() => {
    library.on('block', () => {
      console.log('New block -> update balance')
      mutate()
    })
    return () => {
      library.removeAllListeners('block')
    }
  }, [])

  if (!balance) return <p>Loading balance...</p>
  return <div>{parseFloat(ethers.utils.formatEther(balance)).toPrecision(8)}</div>
}
