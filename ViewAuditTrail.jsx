import React from 'react';
import { useContract, useContractRead } from "@thirdweb-dev/react";

const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS"; // replace with your thirdweb contract

export default function ViewAuditTrail() {
  const { contract } = useContract(CONTRACT_ADDRESS);
  const { data, isLoading } = useContractRead(contract, "getAllDocuments");

  return (
    <div className="fade-in">
      <h2>Blockchain Audit Trail</h2>
      {isLoading && <p>Loading audit log...</p>}
      {data && data.length === 0 && <p>No documents stored yet.</p>}
      {data && data.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Hash</th>
              <th>Metadata</th>
              <th>Submitter</th>
            </tr>
          </thead>
          <tbody>
            {data.map((doc, i) => (
              <tr key={i}>
                <td style={{ maxWidth: "250px", wordWrap: "break-word" }}>{doc.hash}</td>
                <td>{doc.metadata}</td>
                <td>{doc.submitter}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
