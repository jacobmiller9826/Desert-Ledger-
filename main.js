let walletAddress = '';
let sdk;
let contract;

document.getElementById('connectWallet').addEventListener('click', async () => {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      walletAddress = accounts[0];
      document.getElementById('walletAddress').textContent = `Connected: ${walletAddress}`;
      sdk = new thirdweb.ThirdwebSDK("mumbai", { clientId: "YOUR_CLIENT_ID" });
      contract = await sdk.getContract("YOUR_CONTRACT_ADDRESS");
    } catch (err) {
      alert('Error connecting wallet: ' + err.message);
    }
  } else {
    alert('MetaMask not detected');
  }
});

document.getElementById('hashFile').addEventListener('click', async () => {
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
});

document.getElementById('storeHash').addEventListener('click', async () => {
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
  } catch (err) {
    document.getElementById('txStatus').textContent = 'Error: ' + err.message;
  }
});

document.getElementById('loadAudit').addEventListener('click', async () => {
  if (!contract) {
    alert('Please connect your wallet first');
    return;
  }

  document.getElementById('auditTrail').innerHTML = 'Loading...';

  try {
    const stored = await contract.call("getStoredHashes");
    const list = stored.map(hash => `<li>${hash}</li>`).join('');
    document.getElementById('auditTrail').innerHTML = list || '<li>No records found.</li>';
  } catch (err) {
    document.getElementById('auditTrail').innerHTML = 'Error: ' + err.message;
  }
});
