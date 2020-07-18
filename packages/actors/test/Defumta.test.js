const { expect } = require('chai')

describe('Defuma', () => {
  let provider
  let defuma
  let Defuma

  before(async () => {
    const accounts = await ethers.getSigners()
    provider = await accounts[0].getAddress()
    Defuma = await ethers.getContractFactory('Defuma')
  })

  beforeEach(async () => {
    defuma = await Defuma.deploy()
    await defuma.deployed()
  })

  describe('addProvider()', () => {
    it('adds a provider to the list and increases provivderCount', async () => {
      await defuma.addProvider(provider)

      const providerCount = await defuma.providersCount()
      expect(providerCount.toString()).to.eq('1')

      const actualProvider = await defuma.providers(providerCount)
      expect(actualProvider).to.eq(provider)
    })
  })

  describe('addProduct()', () => {
    it('adds a product ipfs hash to the provider', async () => {
      const productHash = 'QmWWQSuPMS6aXCbZKpEjPHPUZN2NjB3YrhJTHsV4X3vb2t'

      await defuma.addProduct(provider, productHash)

      const actualProductHash = await defuma.productIpfs(provider)
      expect(actualProductHash).to.eq(productHash)
    })
  })
})
