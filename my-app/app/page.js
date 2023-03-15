"use client";

import styles from "./page.module.css";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const web3modalRef = useRef();
  const [loading, setLoading] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [ens, setEns] = useState(null);

  const setENSOrAddress = async (userAddress, provider) => {
    try {
      const ens = await provider.lookupAddress(userAddress);
      if (ens) {
        setEns(ens);
      } else {
        setEns(userAddress);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const connectWallet = async () => {
    try {
      setLoading(true);
      const instance = await web3modalRef.current.connect();
      const provider = new ethers.providers.Web3Provider(instance);

      const { chainId } = await provider.getNetwork();
      if (chainId !== 5) {
        console.log("Wrong Network");
        window.alert("Please Switch Network to Goerli");
        throw new Error("Change network to Goerli");
      }

      const signer = provider.getSigner();
      const accountAddress = await signer.getAddress();
      await setENSOrAddress(accountAddress, provider);
      setWalletConnected(true);
      setLoading(false);
    } catch (error) {
      console.log(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    web3modalRef.current = new Web3Modal({
      providerOptions: {},
      network: "goerli",
      disableInjectedProvider: false,
    });
  });

  return (
    <main>
      <div className={styles.main}>
        {!walletConnected ? (
          <button onClick={connectWallet} className={styles.button}>
            {loading ? <span>Connecting...</span> : <span>Connect</span>}
          </button>
        ) : (
          <div>
            {loading ? null : (
              <>
                <div>
                  <h1 className={styles.title}>
                    Welcome to LearnWeb3 Punks - {ens}
                  </h1>
                </div>
                <div className={styles.description}>
                  Its an NFT collection for LearnWeb3 Punks.
                </div>
                <div>
                  <img className={styles.image} src="./learnweb3punks.png" />
                </div>
              </>
            )}
          </div>
        )}
      </div>
      <footer className={styles.footer}>
        Made with &#10084; by LearnWeb3 Punks
      </footer>
    </main>
  );
}
