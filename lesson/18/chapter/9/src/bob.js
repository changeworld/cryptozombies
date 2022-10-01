(async () => {
    const ethers = require('ethers')
    const zksync = require('zksync')
    const utils = require('./utils')
    const token = 'USDT'
    const SLEEP_INTERVAL = process.env.SLEEP_INTERVAL || 5000
    const zkSyncProvider = await utils.getZkSyncProvider(zksync, process.env.NETWORK_NAME)
    const ethersProvider = await utils.getEthereumProvider(ethers, process.env.NETWORK_NAME)
    const bobRinkebyWallet = new ethers.Wallet(process.env.BOB_PRIVATE_KEY, ethersProvider)
    const tokenSet = zkSyncProvider.tokenSet
    console.log(`Bob's Rinkeby address is: ${bobRinkebyWallet.address}`)
    const bobZkSyncWallet = await utils.initAccount(bobRinkebyWallet, zkSyncProvider, zksync)
    console.log(`Bob's initial balance on Rinkeby is: ${await bobZkSyncWallet.getEthereumBalance(token)}`)
    process.on('SIGINT', () => {
        console.log('Disconnecting')
        // Disconnect
        process.exit()
    })
    setInterval(async () => {
        await utils.displayZkSyncBalance(bobZkSyncWallet, tokenSet)
        console.log('---')
    }, SLEEP_INTERVAL)
})()