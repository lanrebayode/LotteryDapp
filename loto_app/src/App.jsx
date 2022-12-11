import { useState, useEffect } from "react";
import Web3 from "web3";
import lotteryContract from "../Blockchain/Contracts/lottery";
import "./App.css";

function App() {
  const [web3, setWeb3] = useState();
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [address, setAddress] = useState();
  const [lcContract, setLcContract] = useState();
  const [lotteryPot, setLotteryPot] = useState();
  const [players, setPlayers] = useState([]);
  const [history, setHistory] = useState([]);
  const [id, setId] = useState();

  useEffect(() => {
    console.log("Hr");
    updateState();
  }, [lcContract]);

  window.ethereum.on("accountChanged", async () => {
    const accounts = await web3.eth.getAccounts();
    setAddress(accounts[0]);
  });

  const updateState = () => {
    if (lcContract) getPot();
    if (lcContract) getPlayers();
    if (lcContract) getHistory();
    if (lcContract) getlotteryid();
  };

  const getPot = async () => {
    //console.log("Pot");
    const Pot = await lcContract.methods.getPotbalance().call();
    setLotteryPot(web3.utils.fromWei(Pot, "ether"));
  };

  const getPlayers = async () => {
    //console.log("Players");
    const lottery_Players = await lcContract.methods.getPlayers().call();
    // console.log(lottery_Players);
    setPlayers(lottery_Players);
  };

  const getHistory = async (id) => {
    console.log("A");
    for (let i = parseInt(id); i > 0; i--) {
      console.log("B");
      console.log("getlotterry");
      const winnerAddress = await lcContract.methods.lotteryhistory(i).call();
      const historyObj = {};
      historyObj.id = i;
      historyObj.address = winnerAddress;
      setHistory((history) => [...history, historyObj]);
    }
  };
  const getlotteryid = async () => {
    const lottery_id = await lcContract.methods.lotteryid().call();
    console.log(lottery_id);
    setId(lottery_id);
    await getHistory(lottery_id);
    console.log(JSON.stringify(history));
  };

  const playNowHandler = async () => {
    //console.log("play Now");
    try {
      const play = await lcContract.methods.Play().send({
        from: address,
        value: web3.utils.toWei("0.01", "ether"),
        gas: 300000,
        gasPrice: null,
      });
      updateState();
    } catch (err) {
      setError(err.message);
    }
  };
  const pickWinnerHandler = async () => {
    setError("");

    setSuccessMsg("");
    console.log("PickWinner");
    try {
      await lcContract.methods.pickWinner().send({
        from: address,
        gas: 300000,
        gasPrice: null,
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const payWinnerHandler = async () => {
    console.log("PickWinner");
    setError("");
    setSuccessMsg("");
    try {
      await lcContract.methods.Paywinner().send({
        from: address,
        gas: 300000,
        gasPrice: null,
      });
      const winnerAddress = await lcContract.methods.lotteryhistory(id).call();
      setSuccessMsg(`The Winner round ${id - 1} is ${winnerAddress}`);
      updateState();
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

          <button onClick={payWinnerHandler} className="pick">
            Pay Winner
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
              {history &&
                history.length > 0 &&
                history.map((item) => {
                  if (id !== item.id) {
                    return (
                      <div>
                        <p>Lottery #{item.id} Winner:</p>
                        <p>
                          <a
                            href={`https://etherscan.io/address/${item.address}`}
                          >
                            {item.address}
                          </a>
                          <br />
                        </p>
                      </div>
                    );
                  }
                })}
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
