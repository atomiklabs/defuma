const { expect } = require('chai')

describe('Defuma', () => {
  let provider, provider2, advertiser
  let defuma, Defuma

  before(async () => {
    const accounts = await ethers.getSigners()
    provider = await accounts[0].getAddress()
    provider2 = await accounts[1].getAddress()
    advertiser = await accounts[2].getAddress()
    Defuma = await ethers.getContractFactory('Defuma')
  })

  beforeEach(async () => {
    defuma = await Defuma.deploy()
    await defuma.deployed()
  })

  describe('Provider', () => {
    describe('registerProvider()', () => {
      it('adds a provider to the list and increases provivderCount', async () => {
        await defuma.registerProvider(provider)

        const providerCount = await defuma.providersCount()
        expect(providerCount).to.eq('1')

        const actualProvider = await defuma.providers(providerCount)
        expect(actualProvider).to.eq(provider)
      })

      it('emits a Provider event', async () => {
        await expect(defuma.registerProvider(provider)).to.emit(defuma, 'Provider')
      })
    })

    describe('addProviderData()', () => {
      it("adds an IPNS hash pointing at Provider's bucket", async () => {
        // Can be a struct if we want to include more data eg:
        //  -  struct Data { ipns: ... , data: {...} }
        //
        // Full meta.json IPNS url:
        //   - https://bafzbeiary6mj2tz5f44wj6hnu42sronswc2aehlbyj4ely4n2rrrwd74ui.ipns.hub.textile.io/meta.json
        const ipnsHash = 'bafzbeiary6mj2tz5f44wj6hnu42sronswc2aehlbyj4ely4n2rrrwd74ui'

        await defuma.addProviderData(provider, ipnsHash)

        const actualProviderData = await defuma.providerData(provider)
        expect(actualProviderData).to.eq(ipnsHash)
      })
    })
  })

  describe('Advertiser', () => {
    const ipnsHash = 'bafzbeiary6mj2tz5f44wj6hnu42sronswc2aehlbyj4ely4n2rrrwd74ui'
    const ipnsHash2 = 'bafzbeifijakwxpxbgqq743l7clqbv3j2oy3ffjgvvcfwd4j47woyn26sru'

    beforeEach(async () => {
      // Register 2 Providers and add data
      await defuma.registerProvider(provider)
      await defuma.registerProvider(provider2)
      await defuma.addProviderData(provider, ipnsHash)
      await defuma.addProviderData(provider2, ipnsHash2)
    })

    it('list all avaliable providers and their data', async () => {
      const providersCount = await defuma.providersCount()
      let result = []

      for (let i = 1; i <= providersCount; i++) {
        const providerAddress = await defuma.providers(i)
        const providerData = await defuma.providerData(providerAddress)
        result = [...result, { [providerAddress]: providerData }]
      }

      const expected = [
        { '0xc783df8a850f42e7F7e57013759C285caa701eB6': ipnsHash },
        { '0xeAD9C93b79Ae7C1591b1FB5323BD777E86e150d4': ipnsHash2 },
      ]
      // Provider 1:
      //   - https://bafzbeiary6mj2tz5f44wj6hnu42sronswc2aehlbyj4ely4n2rrrwd74ui.ipns.hub.textile.io/meta.json
      // Provider 2:
      //   - https://bafzbeifijakwxpxbgqq743l7clqbv3j2oy3ffjgvvcfwd4j47woyn26sru.ipns.hub.textile.io/meta.json

      expect(result).to.deep.eq(expected)
    })
  })
})
