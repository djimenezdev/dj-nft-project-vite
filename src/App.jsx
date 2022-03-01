import "./App.css";
import backgroundVideo from "./assets/background.mp4";
import Music from "./Music";
import nftGif from "./assets/nft.gif";
import { musicData } from "./assets/music";
import { useMoralis } from "react-moralis";
import abi from "./constants.json";
import { useEffect, useState } from "react";
import PropagateLoader from "react-spinners/PropagateLoader";
// main comp
function App() {
  const { authenticate, isAuthenticated, Moralis, logout } = useMoralis();
  const [minted, setMinted] = useState(0);
  const [progress, setProgress] = useState(null);
  const [txURL, setTxURL] = useState("");

  const mintFunc = async () => {
    const transaction = await Moralis.executeFunction({
      contractAddress: "0x248a6344da2d19b21Ace79b784042980204F67e6",
      functionName: "mint",
      abi,
      params: {
        amount: 1,
      },
      msgValue: 1000000000000000,
    });
    setProgress("pending");
    setTxURL(`https://rinkeby.etherscan.io/tx/${transaction.hash}`);
    setProgress(await transaction.wait());
  };

  useEffect(async () => {
    const web3Provider = await Moralis?.enableWeb3();

    // gives access to ethers without having to directly install
    const ethers = Moralis?.web3Library;

    const contract = new ethers.Contract(
      "0x248a6344da2d19b21Ace79b784042980204F67e6",
      abi,
      web3Provider
    );
    setMinted(parseInt(await contract?.totalSupply(0), 16));
  }, [progress?.blockHash]);

  return (
    <div className="App">
      <Music data={musicData} />
      <video
        className="bg-video"
        src={backgroundVideo}
        width={600}
        height={300}
        playsInline={true}
        autoPlay={true}
        loop
        muted
      />
      <div className="main">
        <div className="main-left">
          <img src={nftGif} alt="" />
        </div>
        <div className="main-right">
          {!progress ? (
            <>
              <h3>DJ NFT: Exploring the World of NFTs</h3>
              <p className="description">{minted} minted / 300</p>
              <div className="main-rightButtons">
                <button
                  type="button"
                  className="filled"
                  onClick={isAuthenticated ? mintFunc : authenticate}
                >
                  {isAuthenticated ? "MINT" : "Connect Wallet"}
                </button>
                <button
                  type="button"
                  className="transparentButton"
                  onClick={async () => await logout()}
                >
                  START OVER
                </button>
              </div>
            </>
          ) : progress === "pending" ? (
            <div className="pending-transaction">
              <h3>Transaction In Progress...</h3>
              <div style={{ marginTop: 80 }}>
                <PropagateLoader color="#35baf6" size={10} />
                <div className="main-rightButtonsPending">
                  <button
                    type="button"
                    className="filled"
                    onClick={() => window.open(txURL, "_blank")}
                  >
                    Check Etherscan
                  </button>
                  {/*  <button
                    type="button"
                    className="transparentButton"
                    onClick={async () => await logout()}
                  >
                    START OVER
                  </button> */}
                </div>
              </div>
            </div>
          ) : (
            <>
              <h3>DJ NFT: Exploring the World of NFTs</h3>
              <p className="description">{minted} minted / 300</p>
              <p className="description">Congrats you have minted the NFT!</p>
              <div className="main-rightButtons">
                <button
                  type="button"
                  className="filled"
                  onClick={isAuthenticated ? mintFunc : authenticate}
                >
                  {isAuthenticated ? "MINT" : "Connect Wallet"}
                </button>
                <button
                  type="button"
                  className="transparentButton"
                  onClick={async () => await logout()}
                >
                  START OVER
                </button>
              </div>
            </>
          )}
        </div>
        {/* minting now div only appears if wallet is connected */}
        {isAuthenticated && (
          <div className="minting-now">
            <p>Minting Now</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
