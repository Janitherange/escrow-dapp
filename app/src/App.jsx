import "./App.css";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import deploy from "./deploy";
import Escrow from "./Escrow";

import { Box, Button } from "@chakra-ui/react";

export async function approve(escrowContract, signer) {
  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();
}

function App() {
  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let account = localStorage.getItem("account");
    if (account) {
      connect();
    }
  }, []);

  window?.ethereum?.on("accountsChanged", function (accounts) {
    setAccount(accounts[0]);
  });

  async function connect() {
    let provider;
    if (window.ethereum) {
      provider = new ethers.providers.Web3Provider(window.ethereum);

      await provider
        .send("eth_requestAccounts", [])
        .then((accounts) => {
          setAccount(accounts[0]);
          if (!localStorage.getItem("account")) {
            localStorage.setItem("account", accounts[0]);
          }

          setSigner(provider.getSigner());
          setConnected(true);
        });
    } else {
      alert("Install metamask wallet");
    }
  }

  async function newContract() {
    const beneficiary = document.getElementById("beneficiary").value;
    const arbiter = document.getElementById("arbiter").value;
    const value = ethers.utils.parseUnits(document.getElementById("wei").value);
    const escrowContract = await deploy(signer, arbiter, beneficiary, value);
    console.log(escrowContract.address);
    const escrow = {
      address: escrowContract.address,
      arbiter,
      beneficiary,
      value: value.toString(),
      handleApprove: async () => {
        escrowContract.on("Approved", () => {
          document.getElementById(escrowContract.address).className =
            "complete";
          document.getElementById(escrowContract.address).innerText =
            "✓ It's been approved!";
        });
        await approve(escrowContract, signer);
        console.log(signer);
      },
    };

    setEscrows([...escrows, escrow]);
  }

  return (
    <>
      {!connected ? (
        <Box
          bgGradient="radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)"
          height={window.innerHeight}
          width="100vw"
          color={"white"}
        >
          <Button
            _hover={{
              boxShadow: "rgba(var(--primary-color), 0.5) 0px 0px 20px 0px",
            }}
            bg={
              "radial-gradient(circle, rgba(2,174,202,1) 0%, rgba(148,8,233,1) 100%)"
            }
            borderRadius={"50px"}
            padding={"25px 32px"}
            margin={"5rem 1rem"}
            cursor={"pointer"}
            _active={{
              bg: "radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)",
              transform: "scale(0.9)",
            }}
            position={"absolute"}
            top={"40%"}
            left={"44%"}
            onClick={() => connect()}
          >
            Connect Wallet
          </Button>
          <Box position={"absolute"} top={"60%"} left={"42%"}>
            {!window.ethereum ? "You need to install metamask wallet" : ""}
          </Box>
        </Box>
      ) : (
        <Box
          bgGradient="radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)"
          height={window.innerHeight}
          width="100vw"
          color={"white"}
        >
          <div className="contract">
            <h1> New Contract </h1>
            <label>
              Arbiter Address
              <input type="text" id="arbiter" />
            </label>

            <label>
              Beneficiary Address
              <input type="text" id="beneficiary" />
            </label>

            <label>
              Deposit Amount (in eth)
              <input type="text" id="wei" />
            </label>

            <Button
              id="deploy"
              onClick={(e) => {
                e.preventDefault();

                newContract();
              }}
              _hover={{
                boxShadow: "rgba(var(--primary-color), 0.5) 0px 0px 20px 0px",
              }}
              bg={
                "radial-gradient(circle, rgba(2,174,202,1) 0%, rgba(148,8,233,1) 100%)"
              }
              borderRadius={"50px"}
              padding={"25px 32px"}
              margin={"1rem 5rem"}
              cursor={"pointer"}
              _active={{
                transform: "scale(0.9)",
              }}
              color={"white"}
            >
              Deploy
            </Button>
          </div>

          <div className="existing-contracts">
            <h1> Existing Contracts </h1>

            <div id="container">
              {escrows.map((escrow) => {
                return (
                  <div>
                    <Escrow key={escrow.address} {...escrow} />
                  </div>
                );
              })}
            </div>
          </div>
        </Box>
      )}
    </>
  );
}

export default App;
