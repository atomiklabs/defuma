import React, { FC, useEffect, useState } from 'react'
import { AuthClient } from './authClient'

export const Login: FC = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    ;(async function() {
      setUser(await new AuthClient())
    })()
  }, [])

  console.log('user ', user)

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
