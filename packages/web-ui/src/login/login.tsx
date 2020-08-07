import React, { FC, useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { AuthClient } from './authClient'
import { Defuma } from '../provider/defuma'
import { ContentManager } from '@atomiklabs/content-manager'

export const Login: FC = props => {
  const [user, setUser] = useState(null)
  const { account } = useWeb3React()

  useEffect(() => {
    ;(async function() {
      setUser(await new AuthClient())
    })()
  }, [])

  console.log('user ', user)
  // const user2 = { publicKey: '123', threads: '[]' }

  if (!user) return <Spinner />

  props.setIsLogged(true)

  return (
    <div>
      <div className="card mb-3">
        <div className="card-body">
          <h5 className="card-title">Welcome to DeFuMA!</h5>
          <h6 className="card-subtitle mb-2 text-muted">{account}</h6>
          <br />
          <div className="card-text">
            <div className="card-header">My details:</div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <span className="font-weight-bold">Public key: </span>
                {user.publicKey}
              </li>
              <li className="list-group-item">
                <span className="font-weight-bold">Threads: </span>
                [ ]
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="card mb-3">
        <div className="card-body">
          <Defuma />
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <ContentManager userApiKey="bxikmslquguiw6zcmmcm7glzvtm" userApiSecret="" bucketName="files-miki" />
        </div>
      </div>
    </div>
  )
}

const Spinner = () => (
  <div className="side-load">
    <div className="d-flex justify-content-center">
      <div className="spinner-border" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  </div>
)
