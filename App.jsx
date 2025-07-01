import React from 'react';
import { ConnectWallet } from "@thirdweb-dev/react";
import UploadDocument from './UploadDocument';
import ViewAuditTrail from './ViewAuditTrail';
import './styles.css';

export default function App() {
  return (
    <div>
      <div className="container fade-in">
        <h1>Desert Ledger</h1>
        <p className="tagline">
          Arizona’s Blockchain Document Verification DApp
        </p>
        <ConnectWallet
          btnTitle="Connect Your Wallet"
          modalTitle="Connect to Desert Ledger"
          style={{
            borderRadius: "999px",
            background: "linear-gradient(135deg, #E76F51, #FFC857)",
            color: "white",
            fontWeight: "bold",
            padding: "0.5rem 1rem",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
          }}
        />
        <UploadDocument />
        <hr style={{ margin: "2rem 0", borderColor: "#EDC9AF" }} />
        <ViewAuditTrail />
      </div>
    </div>
  );
}
