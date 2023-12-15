import { Deployer, Reporter } from '@solarity/hardhat-migrate'

import { asciiStringToBytes32 } from './utils'

import {
  UniswapInterfaceMulticall__factory,
  ProxyAdmin__factory,
  TickLens__factory,
  NFTDescriptor__factory,
  NonfungibleTokenPositionDescriptor__factory,
  TransparentUpgradeableProxy__factory,
  NonfungiblePositionManager__factory,
  V3Migrator__factory,
  QuoterV2__factory,
} from '../typechain'

export = async (deployer: Deployer) => {
  const wrappedEther = process.env.WETH9_ADDRESS!
  const nativeCurrencyLabel = process.env.NATIVE_CURRENCY_LABEL!
  const nativeCurrencyLabelBytes = asciiStringToBytes32(nativeCurrencyLabel)
  const v3FactoryAddress = process.env.V3_FACTORY_ADDRESS!
  const finalProxyAdminOwner = process.env.FINAL_PROXY_ADMIN_OWNER

  const uniswapMulticall = await deployer.deploy(UniswapInterfaceMulticall__factory)
  const proxyAdmin = await deployer.deploy(ProxyAdmin__factory)
  const tickLens = await deployer.deploy(TickLens__factory)
  const nftDescriptor = await deployer.deploy(NFTDescriptor__factory)

  const nonFungibleTokenPositionDescriptor = await deployer.deploy(NonfungibleTokenPositionDescriptor__factory, [
    wrappedEther,
    nativeCurrencyLabelBytes,
  ])

  const descriptorProxyAddress = await deployer.deploy(TransparentUpgradeableProxy__factory, [
    nonFungibleTokenPositionDescriptor.address,
    proxyAdmin.address,
    '0x',
  ])

  const nonFungibleTokenPositionManager = await deployer.deploy(NonfungiblePositionManager__factory, [
    v3FactoryAddress,
    wrappedEther,
    descriptorProxyAddress.address,
  ])

  const v3Migrator = await deployer.deploy(V3Migrator__factory, [
    v3FactoryAddress,
    wrappedEther,
    nonFungibleTokenPositionManager.address,
  ])

  const quoterV2 = await deployer.deploy(QuoterV2__factory, [v3FactoryAddress, wrappedEther])

  if (finalProxyAdminOwner) {
    await proxyAdmin.transferOwnership(finalProxyAdminOwner)
  }

  Reporter.reportContracts(
    ['UniswapInterfaceMulticall', uniswapMulticall.address],
    ['ProxyAdmin', proxyAdmin.address],
    ['TickLens', tickLens.address],
    ['NFTDescriptor', nftDescriptor.address],
    ['NonfungibleTokenPositionDescriptor', nonFungibleTokenPositionDescriptor.address],
    ['NonfungibleTokenPositionDescriptor Proxy', descriptorProxyAddress.address],
    ['NonfungiblePositionManager', nonFungibleTokenPositionManager.address],
    ['V3Migrator', v3Migrator.address],
    ['QuoterV2', quoterV2.address]
  )
}
