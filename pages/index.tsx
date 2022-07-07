import Head from 'next/head'
import Image from 'next/image'
import { Contract, ethers, providers, utils } from 'ethers'
import NavBar from '../components/NavBar'
import { useCallback, useState } from 'react'
import { TraitType } from '../types'
import Tabs from '../components/Tab'
import tokenABI from '../abis/long-life-coin.json'
import { unit18 } from '../utils/convert.util'
import {
  faqs,
  MAX_PER_WALLET,
  MINT_COST,
  NFT_CONTRACT_ADDRESS,
  purchaseSteps,
  traitOptions,
  traits,
} from '../types/consts'
import TraitCard from '../components/TraitCard'
import PurchaseStepCard from '../components/PurchaseStepCard'
import { Accordion } from '../components/accordion'
import ArchieNFTAbi from '../abis/archie-nft.json'
import useGlobalState from '../hooks/useGlobalState'
import ConnectWalletButton from '../components/ConnectWalletButton'
import { shimmerUrl } from '../components/blur-image'

const InitState = {
  'bnb-balance': '0',
  'token-balance': '0',
}

export const Home = (): JSX.Element => {
  const [message, setMessage] = useState('')
  const { web3Provider, address } = useGlobalState()
  const [owner, setOwner] = useState('')
  const [state, setState] = useState(InitState)
  // const [chainId, setChainId] = useState(0);
  const [amount, setAmount] = useState(0)
  const [currentId, setCurrentId] = useState(0)
  const EthereumswitchNetwork = async () => {
    try {
      const network = await web3Provider.getNetwork();
      setCurrentId(network.chainId);
    } catch (e) {
      (e) => {
        alert(e.error)
      }
    }
    if (currentId !== 4) {
      try {
        await web3Provider.provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x4' }],
        })
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          alert('add this chain id')
        }
      }
    }
  }
  const BSCswichNetwork = async () => {
    try {
      const network = await web3Provider.getNetwork();
      setCurrentId(network.chainId);
    } catch (e) {
      (e) => {
        alert(e.error)
      }
    }

    if (currentId !== 97) {
      try {
        await web3Provider.provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x61' }],
        })
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          alert('add this chain id')
        }
      }
    }
  }
  const getETHinfo = async () => {
    const llc_eth_address = tokenABI.Rinkeby.address
    const ethContract = new Contract(
      llc_eth_address,
      tokenABI.Rinkeby.abi,
      web3Provider.getSigner()
    )
    const contract_balance = await ethContract.balanceOf(llc_eth_address)
    const eth_amount = await web3Provider.getBalance(llc_eth_address)
    setState({
      ...state,
      'bnb-balance': utils.formatUnits(eth_amount),
      'token-balance': utils.formatUnits(contract_balance),
    })
  }
  const getBSCinfo = async () => {
    const llc_bsc_address = tokenABI.BSCT.address
    const bnbContract = new Contract(
      llc_bsc_address,
      tokenABI.BSCT.abi,
      web3Provider.getSigner()
    )
    const contract_balance = await bnbContract.balanceOf(llc_bsc_address)
    const bnb_amount = await web3Provider.getBalance(llc_bsc_address)
    setState({
      ...state,
      'bnb-balance': utils.formatUnits(bnb_amount),
      'token-balance': utils.formatUnits(contract_balance),
    })
  }
  const withdraw = useCallback(async () => {
    // if (amount === 0 || amount > MAX_PER_WALLET) {
    //   setMessage('Please put a valid mint amount.');
    //   return;
    // }
    const network = await web3Provider.getNetwork();
    const chainId = network.chainId;
    try {
      if (chainId == 4) {
        const contract = new Contract(tokenABI.Rinkeby.address, tokenABI.Rinkeby.abi, web3Provider.getSigner());
        const tx = await contract.withdraw();
        await tx.wait();
      }
      if (chainId == 97) {
        const contract = new Contract(tokenABI.BSCT.address, tokenABI.BSCT.abi, web3Provider.getSigner());
        const tx = await contract.withdraw();
        await tx.wait();

      }
      // const owner_address = '0xcFF288e836c6DCa378dD53928E6498419a371Ea2';
      // setOwner(getOwner);
      // console.log(owner);
      // if (owner != owner_address) {
      //   await bnbContract.transferOwnership(owner_address);
      //   setOwner(owner_address);
      // }
      // const withdrawtx = await bnbContract.withdraw()
      // await withdrawtx.wait()
      // const payAmount = MINT_COST.mul(amount);
      // const mintTx = await bnbContract.mint(address, amount, { value: owner === address ? 0 : payAmount });
      // await mintTx.wait();
    } catch (e) {
      // eslint-disable-next-line no-console
      setMessage(e.reason || e.message || 'Contract interaction error')
    }
  }, [address, amount, web3Provider, setState])
  return (
    <div className="">
      <Head>
        <title>WTTHDRAW</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <NavBar />
      </header>

      <main className="container mt-16 mx-auto px-3 md:px-4">
        <section id="mint">
          <div className="flex justify-center items-center">
            {currentId == 4 ? (
              <button className="btn mx-8 my-4" onClick={getETHinfo}>
                Contract Status
              </button>
            ) : (
              <button className="btn mx-8 my-4" onClick={EthereumswitchNetwork}>
                Switch Ethereum
              </button>
            )}
            {currentId == 97 ? (
              <button className="btn mx-8 my-4" onClick={getBSCinfo}>
                Contract Status
              </button>
            ) : (
              <button className="btn mx-8 my-4" onClick={BSCswichNetwork}>
                Switch BSC
              </button>
            )}
          </div>
          <p className="text-center text-4xl font-bold text-sky-700 uppercase">
            withdraw
          </p>
          <div className="max-w-full md:max-w-screen-lg mx-auto mt-4 flex flex-col items-center md:flex-row">
            {/* <div className="w-full md:w-1/2 px-0 md:px-4">
              <Image src="/assets/showcase1.gif" layout="responsive" width={400} height={400} alt="nekos" placeholder="blur" blurDataURL={shimmerUrl}/>
            </div> */}
            <div className="w-full md: mt-6 md:mt-0 flex flex-col px-4">
              <div className="mt-6 flex-col items-center justify-center">
                <p className="mb-2 text-2xl text-blue-700 uppercase text-center">
                  Please determind the amount of currency that you wanna
                  withdraw
                </p>
                {/* <div className="mb-4 flex justify-center">
                  <button className="bg-white hover:bg-gray-100 active:bg-gray-200 text-xl font-bold pl-4 pr-2 py-2 text-gray-900 rounded-l-full h-12" onClick={() => setAmount(Math.max(0, amount - 1))}>-</button>
                  <input type="number" className="w-20 h-12 outline-0 text-gray-900 text-center" placeholder="1" value={amount} onChange={evt => setAmount(Number(evt.target.value))} />
                  <button className="bg-white hover:bg-gray-100 active:bg-gray-200 text-xl font-bold pl-2 pr-4 py-2 text-gray-900 rounded-r-full h-12" onClick={() => setAmount(Math.min(MAX_PER_WALLET, amount + 1))}>+</button>
                </div> */}
                <div className="flex-col">
                  <p className="text-center mb-2">
                    {/* {chainID == 97 ? 'BNB' : 'ETH'} */}
                    Balance of Contract: {state['bnb-balance']}
                  </p>
                  <p className="text-center mb-2">
                    LLC Balance of Contract: {state['token-balance']}
                  </p>
                </div>
                <div className="flex justify-center">
                  {web3Provider ? (
                    <button className="btn mt-6 w-64 " onClick={withdraw}>
                      WITHDRAW
                    </button>
                  ) : (
                    <ConnectWalletButton />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* <section className="mt-20">
          <p className="text-center text-lg font-semibold">Welcome to our community. Being part of the Archie Neko club introduces you to a community of world wide entrepreneurs. It will give you the opportunity to get in touch with masters of e-commerce already set-up in the real life business. Many IRL meet up events as online events will be organized between holders so that they can exchange their network, discuss marketing strategies and all subjects related to their business, so we can grow up and improve together.</p>
          <div className="mt-12 flex flex-col items-center md:flex-row">
            <div className="w-full md:w-1/2 px-0 md:px-4">
              <Image src="/assets/showcase2.gif" layout="responsive" width={400} height={400} alt="nekos" placeholder="blur" blurDataURL={shimmerUrl}/>
            </div>
            <div className="w-full md:w-1/2 mt-6 md:mt-0 flex flex-col px-4">
              <p className="text-sky-500 font-medium">ABOUT</p>
              <p className="text-3xl font-bold font-semibold mr-0 xl:mr-20">25,000 UNIQUE ARCHIE NEKO WHO NEED DRIVERS</p>
              <p className="mt-10 text-lg font-medium">The Archie Neko is a collection of 25,000 generative Archie Neko with hundreds of elements.</p>
              <p className="mt-6 text-lg font-medium">Each artwork is original, with its own color palette and creation. The objective was to make each Archie Neko unique in order to prioritize quality above quantity.</p>
            </div>
          </div>
        </section>

        <section className="mt-20">
          <p className="text-center text-4xl font-semibold text-sky-500">TRAIT RARITY</p>
          <div className="w-full flex justify-center">
            <Tabs options={traitOptions} selected={traitSelected} onChange={setTraitSelected}/>
          </div>
          <div className="py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {traits[traitSelected].map(trait => <TraitCard key={trait.name} trait={trait} traitType={traitSelected}/>)}
          </div>
        </section>

        <section className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-4">
          {purchaseSteps.map(step => <PurchaseStepCard
            key={step.title}
            image={step.image}
            title={step.title}
            content={step.content}
            label={step.label}
            link={step.link}
            padding={step.padding}
          />)}
        </section>

        <section className="mt-20">
          <p className="text-4xl mb-10 text-sky-500 text-center font-bold">FREQUENTLY ASKED QUESTIONS</p>
          <div className="px-0 md:px-20">
            {faqs.map(faq => <Accordion content={faq.content} name={faq.title} key={faq.title} expanded/>)}
          </div>
        </section>

        <section className="mt-20">
          <p className="text-2xl text-sky-500 font-semibold text-center">What are you waiting for?</p>
          <p className="text-4xl font-bold text-center mt-6">BECOME AN ARCHIE NEKO</p>
        </section>

        <section className="mt-20">
          <div className="flex justify-center mb-2">
            <Image src="/assets/logo-with-text.svg" alt="logo with text" width="300" height="31"/>
          </div>
          <p className="text-sky-500 text-center font-semibold pb-4">&copy;2022 ARCHIE NEKO CLUB. All rights reserved</p>
        </section> */}
      </main>
    </div>
  )
}

export default Home
