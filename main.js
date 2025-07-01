import { ThirdwebSDK } from "https://esm.sh/@thirdweb-dev/sdk@4";
import { ethers } from "https://esm.sh/ethers@6";

console.log("Desert Ledger Script Loaded");

const CLIENT_ID = "05a0325af41e925b0e2ff52a16efa407";
const CONTRACT_ADDRESS = "0xC52a002023ABA42B4490f625Df6434fc26E425c8";

let walletAddress = '';
let provider;
let signer;
let sdk;
let contract;

// Wait for DOMContentLoaded before hooking up listeners
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM fully loaded and parsed");

  const connectButton = document.getElementById('connectWallet');
  const hashButton = document.getElementById('hashFile');
  const storeButton = document.getElementById('storeHash');
  const loadButton = document.getElementById('loadAudit');

  connectButton.addEventListener('click', connectWallet);
  hashButton.addEventListener('click', generateHash);
  storeButton.addEventListener('click', storeHashOnChain);
  loadButton.addEventListener('click', loadAuditTrail);
});

async function connectWallet() {
  console.log("Connect button clicked");
  if (typeof window.ethereum !== 'undefined') {
    try {
      provider = new ethers.BrowserProvider(window.ethereum);
      signer = await provider.getSigner();
      walletAddress = await signer.getAddress();

      document.getElementById('walletAddress').textContent = `Connected: ${walletAddress}`;

      sdk = new ThirdwebSDK("mumbai", { clientId: CLIENT_ID });
      contract = await sdk.getContract(CONTRACT_ADDRESS);

      console.log("Wallet connected, contract loaded.");
    } catch (err) {
      alert('Error connecting wallet: ' + err.message);
    }
  } else {
    alert('MetaMask not detected.\nPlease:\n- Install MetaMask extension\n- Use a supported browser\n- Open this page from HTTPS.');
  }
}

async function generateHash() {
  console.log("Hash button clicked");
  const fileInput = document.getElementById('fileInput').files[0];
  if (!fileInput) {
    alert('Please select a file');
    return;
  }

  const arrayBuffer = await fileInput.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  document.getElementById('hashOutput').textContent = `SHA-256: ${hashHex}`;

  console.log("Hash generated:", hashHex);
}

async function storeHashOnChain() {
  console.log("Store button clicked");
  const hash = document.getElementById('hashOutput').textContent.replace('SHA-256: ', '');
  if (!hash) {
    alert('Please generate a hash first');
    return;
  }
  if (!contract) {
    alert('Please connect your wallet first');
    return;
  }

  document.getElementById('txStatus').textContent = 'Sending transaction...';
  try {
    const tx = await contract.call("storeDocumentHash", [hash]);
    document.getElementById('txStatus').textContent = `Stored on-chain! Tx: ${tx.receipt.transactionHash}`;
    console.log("Transaction successful:", tx.receipt.transactionHash);
  } catch (err) {
    document.getElementById('txStatus').textContent = 'Error: ' + err.message;
    console.error("Transaction error:", err);
  }
}

async function loadAuditTrail() {
  console.log("Load Audit button clicked");
  if (!contract) {
    alert('Please connect your wallet first');
    return;
  }

  document.getElementById('auditTrail').innerHTML = 'Loading...';

  try {
    const stored = await contract.call("getStoredHashes");
    const list = stored.map(hash => `<li>${hash}</li>`).join('');
    document.getElementById('auditTrail').innerHTML = list || '<li>No records found.</li>';
    console.log("Audit trail loaded:", stored);
  } catch (err) {
    document.getElementById('auditTrail').innerHTML = 'Error: ' + err.message;
    console.error("Audit trail error:", err);
  }
}
