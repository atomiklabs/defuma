import React, { FC, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Login } from '../login'

export const Provider: FC = () => {
  const { chainId, account, active } = useWeb3React()
  const [isLogged, setIsLogged] = useState(false)

  if (!active) return <div></div>

  return (
    <div>
      <div className="row">
        <div className="col-5">
          <div className="sidenav">
            <div className="login-main-text">
              <h2>Decentralised Full-Market</h2>
              <p>{isLogged ? 'Logged: ' + account : 'Login with Metamask (Rinkeby) to access.'}</p>
            </div>
            <div className="main">
              <div className="col-md-6 col-sm-12">
                <div className="login-form"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-7 align-self-center side-content">{active && <Login setIsLogged={setIsLogged}/>}</div>
      </div>
    </div>
  )
}
