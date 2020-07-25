import React, { FC, useEffect, useState } from 'react'
import { AuthClient } from './authClient'
// BUG: CRA + yarn workspaces
//  - import { AuthClient } from '@atomiklabs/auth'
// BUG: Relative imports outside of src/ are not supported
//  - import { AuthClient } from '../../../auth/src/index'

export const Login: FC = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    initAuth()
  }, [])

  const initAuth = async () => {
    const authClient = new AuthClient()
    await authClient.setupIdentity()
    await authClient.login()
    await authClient.listThreads()
    setUser(authClient)
  }

  if (!user) return <h2>Please authorize and log in...</h2>

  return (
    <div>
      <h2>Welcome to DeFuMA! </h2>
      <h3>Your details:</h3>
      <ul>
        <li>Publick key: {user.publicKey}</li>
        <li>Threads: {user.threads}</li>
      </ul>
      <hr />
    </div>
  )
}
