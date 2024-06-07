import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [ethInput, setEthInput] = useState('');
  const [convertedValue, setConvertedValue] = useState(0);
  const [isFrozen, setIsFrozen] = useState(false); // New state variable for freeze/unfreeze

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

  const connectAccount = async () => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }

    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);

    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  }

  const getBalance = async () => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  }

  const deposit = async () => {
    if (atm && !isFrozen) {
      let tx = await atm.deposit(18);
      await tx.wait()
      getBalance();
    }
  }

  const withdraw = async () => {
    if (atm && !isFrozen) {
      let tx = await atm.withdraw(9);
      await tx.wait()
      getBalance();
    }
  }

  const handleEthInputChange = (e) => {
    const value = e.target.value;
    setEthInput(value);
    setConvertedValue(value * 224259);
  }

  const toggleFreeze = () => {
    setIsFrozen(!isFrozen);
  }

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount} style={{ padding: '10px 20px', fontSize: '16px' }}>Please connect your Metamask wallet</button>
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div>
        <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>Your Account: {account}</p>
        <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>Your Balance: {balance}</p>
        <button 
          onClick={deposit} 
          disabled={isFrozen} 
          style={{
            position: 'relative',
            backgroundColor: 'rgb(0, 123, 255)', // Ocean blue color for deposit button
            borderRadius: '5px',
            boxShadow: 'rgb(0, 90, 180) 0px 4px 0px 0px',
            padding: '15px',
            backgroundRepeat: 'no-repeat',
            cursor: 'pointer',
            boxSizing: 'border-box',
            width: '154px',
            height: 'auto',
            color: '#fff',
            border: 'none',
            fontSize: '20px',
            transition: 'all 0.3s ease-in-out',
            zIndex: 1,
            overflow: 'hidden',
            whiteSpace: 'normal',
            wordWrap: 'break-word',
            textAlign: 'center',
            margin: '10px 5px',
          }}>
          Deposit 18 ETH
          <style jsx>{`
            button::before {
              content: "";
              background-color: rgb(173, 216, 230); // Light blue color for deposit button
              width: 0;
              height: 100%;
              position: absolute;
              top: 0;
              left: 0;
              z-index: -1;
              transition: width 700ms ease-in-out;
              display: inline-block;
            }
            button:hover::before {
              width: 100%;
            }
            button:active {
              transform: translate(5px,5px);
              transition-duration: .3s;
            }
          `}</style>
        </button>
        <button 
          onClick={withdraw} 
          disabled={isFrozen} 
          style={{
            position: 'relative',
            backgroundColor: 'rgb(230, 34, 77)', // Original color for withdraw button
            borderRadius: '5px',
            boxShadow: 'rgb(121, 18, 55) 0px 4px 0px 0px',
            padding: '15px',
            backgroundRepeat: 'no-repeat',
            cursor: 'pointer',
            boxSizing: 'border-box',
            width: '154px',
            height: 'auto',
            color: '#fff',
            border: 'none',
            fontSize: '20px',
            transition: 'all 0.3s ease-in-out',
            zIndex: 1,
            overflow: 'hidden',
            whiteSpace: 'normal',
            wordWrap: 'break-word',
            textAlign: 'center',
            margin: '10px 5px',
          }}>
          Withdraw 9 ETH
          <style jsx>{`
            button::before {
              content: "";
              background-color: rgb(248, 50, 93); // Original color for withdraw button
              width: 0;
              height: 100%;
              position: absolute;
              top: 0;
              left: 0;
              z-index: -1;
              transition: width 700ms ease-in-out;
              display: inline-block;
            }
            button:hover::before {
              width: 100%;
            }
            button:active {
              transform: translate(5px,5px);
              transition-duration: .3s;
            }
          `}</style>
        </button>
        <div>
          <input
            type="number"
            value={ethInput}
            onChange={handleEthInputChange}
            placeholder="Enter ETH amount"
            disabled={isFrozen}
            style={{ 
              padding: '10px', 
              fontSize: '16px', 
              margin: '5px', 
              border: '1px solid #ccc',
              borderRadius: '5px',
              boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)',
              transition: 'border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
              width: 'calc(100% - 22px)', // Adjusted for padding and border
              boxSizing: 'border-box'
            }}
            onFocus={(e) => e.target.style.borderColor = '#007bff'}
            onBlur={(e) => e.target.style.borderColor = '#ccc'}
          />
          <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}> Convertion Checker to ETH TO PHP: {convertedValue}</p>
        </div>
        <button 
  onClick={toggleFreeze} 
  style={{
    position: 'relative',
    backgroundColor: 'rgb(135, 206, 235)', // Icy blue color for freeze button
    borderRadius: '5px',
    boxShadow: 'rgb(0, 139, 139) 0px 4px 0px 0px',
    padding: '15px',
    cursor: 'pointer',
    boxSizing: 'border-box',
    width: '154px',
    height: 'auto',
    color: '#fff',
    border: 'none',
    fontSize: '20px',
    transition: 'all 0.3s ease-in-out',
    zIndex: 1,
    overflow: 'hidden',
    whiteSpace: 'normal',
    wordWrap: 'break-word',
    textAlign: 'center',
    margin: '10px 0',
  }}>
  {isFrozen ? "Unfreeze" : "Freeze"}
  <style jsx>{`
    button::before {
      content: "";
      background-color: rgb(173, 216, 230); // Light blue color for freeze button hover effect
      width: 0;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      transition: width 700ms ease-in-out;
      display: inline-block;
    }
    button:hover::before {
      width: 100%;
    }
    button:active {
      transform: translate(5px,5px);
       transition-duration: .3s;
    }
    
  `}</style>
</button>
      </div>
    )
  }

  useEffect(() => { getWallet(); }, []);

  return (
    <main className="container">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Tiny5&display=swap" rel="stylesheet" />
      </head>
      <header style={{
        backgroundColor: '#007bff',
        color: '#fff',
        padding: '20px 0',
        borderRadius: '5px',
        marginBottom: '20px',
        border: '5px solid #0056b3',
        fontFamily: 'Tiny5, sans-serif', // Applying the font style to the header
      }}>
        <h1 style={{ margin: '0', fontSize: '2em' }}>Welcome to the Zy's ATM!</h1>
      </header>
      {initUser()}

      <style jsx>{`
        .container {
          text-align: center;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }
      `}</style>
    </main>
  )
}
