import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import { useContract, useContractWrite } from "@thirdweb-dev/react";

const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS"; // replace with your thirdweb contract

export default function UploadDocument() {
  const [file, setFile] = useState(null);
  const [hash, setHash] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const { contract } = useContract(CONTRACT_ADDRESS);
  const { mutateAsync: storeHash } = useContractWrite(contract, "storeDocumentHash");

  async function handleFileChange(e) {
    const uploaded = e.target.files[0];
    setFile(uploaded);

    const arrayBuffer = await uploaded.arrayBuffer();
    const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
    const sha256Hash = CryptoJS.SHA256(wordArray).toString();
    setHash(sha256Hash);
  }

  async function handleSubmit() {
    if (!contract || !hash) {
      setStatus("Missing contract or hash");
      return;
    }
    try {
      setLoading(true);
      setStatus("Submitting to blockchain...");
      await storeHash({ args: [hash, "Arizona Verification"] });
      setStatus("✅ Document hash stored on-chain!");
    } catch (err) {
      console.error(err);
      setStatus("❌ Error storing hash.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fade-in">
      <h2>Upload & Verify Document</h2>
      <input type="file" onChange={handleFileChange} />
      {hash && (
        <p>
          <strong>SHA-256 Hash:</strong><br /> 
          <code style={{ wordWrap: "break-word" }}>{hash}</code>
        </p>
      )}
      <button onClick={handleSubmit} disabled={!hash || loading}>
        {loading ? "Submitting..." : "Store on Blockchain"}
      </button>
      <p>{status}</p>
    </div>
  );
}
