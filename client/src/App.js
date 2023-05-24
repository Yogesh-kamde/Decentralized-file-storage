import upload from "./artifacts/contracts/upload.sol/Upload.json"
import './App.css';
import {useState,useEffect} from "react";
// import {ethers} from "ethers";
// const ethers = require("ethers")
import { ethers } from "ethers";
import Fileupload from "./Component/Fileupload";
import Display from "./Component/Display";
import Modal from "./Component/Modal";

function App() {
    const[account,setAccount] = useState("");
    const[contract,setContract] = useState("");
    const[provider,setProvider] = useState(null);
    const[modalOpen,setModalOpen] = useState(false);

    useEffect(()=> {
      //for reading data from blockchain we use provider
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const loadprovider = async() => {
        //checking is provider is present or not.
        if(provider){
          window.ethereum.on("chainChanged",()=>{
            window.location.reload();
          });
          window.ethereum.on("accountsChanged",()=>{
            window.location.reload();
          });
          await provider.send("eth_requestAccounts", []);
          // await provider.send("eth_requestAccount",[]);//eth_request will open metamask account automatically
          //to write data in blockchain we use signer
          const signer = provider.getSigner();
          const address = await signer.getAddress();
          setAccount(address);
          // let contractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0 ";
          let contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
          // let contractAddress = "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199 ";
          //creating contract instance
          const contract = new ethers.Contract(
          contractAddress,upload.abi,signer)
          setContract(contract)
          setProvider(provider)
        }else{
          console.error("Metamask is not installed!!");
        }
      };
      provider && loadprovider()
    },[]);
    
    return(
    <>
     {!modalOpen && (
        <button className="share" onClick={() => setModalOpen(true)}>
          Share
        </button>
      )}
     {modalOpen &&(<Modal setModalOpen = {setModalOpen} contract = {contract}></Modal>)}
    <div className="App">
    <h1 style={{color:"white"}}>D-Drive</h1>
    <div class="bg"></div>
    <div class="bg bg2"></div>
    <div class="bg bg3"></div>
    <p style={{color:"white"}}>Account:{account?account:"Not connected"}</p>
    <Fileupload 
    account ={account} 
    provider ={provider}
    contract={contract}
    ></Fileupload>
    <Display contract={contract} account={account}></Display>
    
    </div>
    </>
    );
}

export default App;
