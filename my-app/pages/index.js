import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import Web3Modal from 'web3modal';
import { providers, Contract } from 'ethers';
import { WHITELIST_CONTRACT_ADDRESS, abi } from '../constants';
import styles from '../styles/Home.module.css';

export default function Home() {
  // check if wallet is connected
  const [walletConnected, setWalletConnected] = useState(false);
  // check if current connected user has joined whitelist
  const [joinedWhitelist, setJoinedWhitelist] = useState(false);
  // loading state
  const [loading, setLoading] = useState(false);
  // track num of whitelisted users
  const [numberOfWhitelisted, setNumberOfWhitelisted] = useState(0);
  // create ref for web3modal
  const web3modalRef = useRef();

  // get provider or signer from metamask prolly with signer fts
  const getProviderOrSigner = async (needSigner = false) => {
    // first connect to metamask
    const provider = await web3modalRef.current.connect();
    const web3provider = new providers.Web3Provider(provider);

    // warn that user should be in rinkeby network
    const { chainId } = await web3provider.getNetwork();
    if (chainId != 4) {
      window.alert('Change the network to rinkeby');
      throw new Error('Change network to Rinkeby');
    }

    if (needSigner) {
      const signer = web3provider.getSigner();
      return signer;
    }
    return web3provider;
  };

  // add address to whitelist
  const addAddressToWhitelist = async () => {
    try {
      // signer is needed here
      const signer = await getProviderOrSigner(true);
      // creata a new instance of contract with a signer which allows update
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );
      // call add to address fn
      const tx = await whitelistContract.addAddressToWhitelist();
      setLoading(true);
      // wait for txn to get mined
      await tx.wait();
      setLoading(false);
      // get the updated num of addresses in the whitelist
      await getNumberOfWhitelisted();
      setJoinedWhitelist(true);
    } catch (error) {
      console.error(error);
    }
  };

  // get number of whitelisted addresses
  const getNumberOfWhitelisted = async () => {
    try {
      // no need to sign so we need only provider
      const provider = await getProviderOrSigner();
      // connect to ctrct to read from it's state
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        provider
      );
      // call numWhitelisted from contract
      const _numberOfWhitelisted =
        await whitelistContract.numAddressesWhitelisted();
      setNumberOfWhitelisted(_numberOfWhitelisted);
    } catch (error) {
      console.error(error);
    }
  };

  // check if address is whitelisted already
  const checkIfAddressInWhitelist = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );
      // get address of signer
      const address = await signer.getAddress();
      // call fn to check map of addr to bool
      const _joinedWhitelist = await whitelistContract.whitelistedAddresses(
        address
      );
      setJoinedWhitelist(_joinedWhitelist);
    } catch (error) {}
  };

  // connectWallet to metamask
  const connectWallet = async () => {
    try {
      // get provider from web3modal
      await getProviderOrSigner();
      setWalletConnected(true);

      checkIfAddressInWhitelist();
      getNumberOfWhitelisted();
    } catch (error) {
      console.error(error);
    }
  };

  // render button, copied
  const renderButton = () => {
    if (walletConnected) {
      if (joinedWhitelist) {
        return (
          <div className={styles.description}>
            Thanks for joining the Whitelist!
          </div>
        );
      } else if (loading) {
        return <button className={styles.button}>Loading...</button>;
      } else {
        return (
          <button onClick={addAddressToWhitelist} className={styles.button}>
            Join the Whitelist
          </button>
        );
      }
    } else {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect your wallet
        </button>
      );
    }
  };

  useEffect(() => {
    if (!walletConnected) {
      // assign web3modal ref to a web3modal instance
      web3modalRef.current = new Web3Modal({
        network: 'rinkeby',
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected]);

  // UI, copied
  return (
    <div>
      <Head>
        <title>Whitelist Dapp</title>
        <meta name='description' content='Whitelist-Dapp' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to Crypto Devs!</h1>
          <div className={styles.description}>
            Its an NFT collection for developers in Crypto.
          </div>
          <div className={styles.description}>
            {numberOfWhitelisted} have already joined the Whitelist
          </div>
          {renderButton()}
        </div>
        <div>
          <img className={styles.image} src='./crypto-devs.svg' />
        </div>
      </div>

      <footer className={styles.footer}>
        Made with &#10084; by Crypto Devs
      </footer>
    </div>
  );
}
