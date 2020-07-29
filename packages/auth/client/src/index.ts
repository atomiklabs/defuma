import { Client, UserAuth } from '@textile/hub'
import { Libp2pCryptoIdentity, Identity } from '@textile/threads-core'
import Box from '3box'

const getIdentity = async (): Promise<Libp2pCryptoIdentity> => {
  const box = await Box.create((window as any).ethereum)
  const [address] = await (window as any).ethereum.enable()
  await box.auth([], { address })
  const space = await box.openSpace('io-textile-dropzone')
  await box.syncDone
  try {
    const storedIdent = await space.private.get('identity')
    if (storedIdent === null) {
      throw new Error('No identity')
    }
    const identity = await Libp2pCryptoIdentity.fromString(storedIdent)
    return identity
  } catch (e) {
    const identity = await Libp2pCryptoIdentity.fromRandom()
    const identityString = identity.toString()
    await space.private.set('identity', identityString)
    return identity
  }
}

const loginWithChallenge = (identity: Identity): (() => Promise<UserAuth>) => {
  return () => {
    return new Promise((resolve, reject) => {
      const socketUrl = 'ws://localhost:3001/ws/userauth'
      const socket = new WebSocket(socketUrl)

      socket.onopen = () => {
        const publicKey = identity.public.toString()

        socket.send(
          JSON.stringify({
            pubkey: publicKey,
            type: 'token'
          })
        )

        socket.onmessage = async event => {
          const data = JSON.parse(event.data)
          switch (data.type) {
            case 'error': {
              reject(data.value)
              break
            }
            case 'challenge': {
              const buf = Buffer.from(data.value)
              const signed = await identity.sign(buf)

              socket.send(
                JSON.stringify({
                  type: 'challenge',
                  sig: Buffer.from(signed).toJSON()
                })
              )
              break
            }

            case 'token': {
              resolve(data.value)
              break
            }
          }
        }
      }
    })
  }
}

export class AuthClient {
  id?: Libp2pCryptoIdentity
  client?: Client
  identity?: string
  publicKey?: string
  threads?: string

  constructor() {
    return this.init() as any
  }

  init = async () => {
    await this.setupIdentity()
    await this.login()
    await this.listThreads()
    return this
  }

  sign = async (buf: Buffer) => {
    if (!this.id) throw Error('No user ID found')
    return this.id.sign(buf)
  }
  setupIdentity = async () => {
    this.id = await getIdentity()
    this.identity = this.id.toString()
    this.publicKey = this.id.public.toString()
  }

  listThreads = async () => {
    if (!this.client) throw Error('User not authenticated')
    const result = await this.client.listThreads()
    this.threads = JSON.stringify(result.listList)
  }

  login = async () => {
    if (!this.id) throw Error('No user ID found')
    const loginCallback = loginWithChallenge(this.id)
    this.client = Client.withUserAuth(loginCallback)
    console.log('Logged in: verified on Textile API')
  }
}
