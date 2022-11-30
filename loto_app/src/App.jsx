import { useState, useEffect } from "react";
import Web3 from "web3";
import lotteryContract from "../Blockchain/Contracts/lottery";
import "./App.css";

function App() {
  const [web3, setWeb3] = useState();
  const [error, setError] = useState("");
  const [address, setAddress] = useState();
  const [lcContract, setLcContract] = useState();
  const [lotteryPot, setLotteryPot] = useState();
  const [players, setPlayers] = useState([]);
  const [history, setHistory] = useState();
  const [id, setId] = useState();

  useEffect(() => {
    // console.log("Hr");
    if (lcContract) getPot();
    if (lcContract) getPlayers();
  }, [lcContract, lotteryPot, players]);

  const getPot = async () => {
    console.log("Pot");
    const Pot = await lcContract.methods.getPotbalance().call();
    setLotteryPot(web3.utils.fromWei(Pot, "ether"));
  };

  const getPlayers = async () => {
    //console.log("Players");
    const lottery_Players = await lcContract.methods.getPlayers().call();
    // console.log(lottery_Players);
    setPlayers(lottery_Players);
  };

  const getHistory = async () => {
    const lottery_history = await lcContract.methods.lotteryhistory().call();
    setHistory(lottery_history);
    console.log(JSON.parse(lottery_history));
  };
  const getId = async () => {
    const lottery_id = await lcContract.methods.lotteryid().call();
    // setHistory(lottery_id);
    console.log(lottery_id);
    setId(lottery_id);
  };

  const playNowHandler = async () => {
    console.log("play Now");
    try {
      const play = await lcContract.methods.Play().send({
        from: address,
        value: web3.utils.toWei("0.01", "ether"),
        gas: 300000,
        gasPrice: null,
      });
    } catch (err) {
      setError(err.message);
    }
  };
  const pickWinnerHandler = async () => {
    setError("");
    try {
      const play = await lcContract.methods.Paywinner().send({
        from: address,
        gas: 300000,
        gasPrice: null,
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const connectWalletHandler = async () => {
    setError("");
    if (
      typeof window !== "undefined" &&
      typeof window.ethereum !== "undefined"
    ) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });

        const web3 = new Web3(window.ethereum);
        setWeb3(web3);

        const accounts = await web3.eth.getAccounts();
        setAddress(accounts[0]);
        //console.log(accounts);

        //create local contract copy
        const lc = lotteryContract(web3);
        setLcContract(lc);
      } catch (err) {
        setError(err.message);
      }
    } else {
      console.log("No MetaMask");
    }
  };

  return (
    <div>
      <div className="Nav">
        <h1>Rex Lottery</h1>
        <button className="button" onClick={connectWalletHandler}>
          Connect Wallet
        </button>
      </div>
      <div className="columns">
        <div className="column1">
          <p>Enter the Lottery buy sending 0.01Ether</p>
          <button onClick={playNowHandler}>Play Now</button>
          <button onClick={playNowHandler} className="play">
            Play Now!
          </button>
          <p>
            <b>Admin Only:</b> Pick Winner
          </p>
          <button onClick={pickWinnerHandler} className="pick">
            Pick Winner
          </button>
          <section>
            <div className="error">
              <h3>{error}</h3>
            </div>
          </section>
        </div>
        <div className="column2">
          <div className="history">
            <div className="data-tab">
              <h2>Lottery History</h2>
              <p>Lottery #1 Winner:</p>
              <p>
                <a href="https://etherscan.io/address/0x60b2ECb7c8Ed53Bb4b4338860c1CcfCAa5Ff1218">
                  0x60b2ECb7c8Ed53Bb4b4338860c1CcfCAa5Ff1218
                </a>
                <br />
              </p>
            </div>
            <div className="data-tab">
              <h1>Players({players.length})</h1>
              <ul>
                {players.map((player) => {
                  return (
                    <li>
                      <a
                        href={`https://https://etherscan.io/address/${player}`}
                      >
                        {player}
                      </a>
                      ;
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="data-tab">
              <h2>Pot Balance:</h2>
              <p>{lotteryPot} Ether</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
