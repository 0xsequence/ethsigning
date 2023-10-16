import React from "react";
import Layout from "@theme/Layout";
import ethers from "ethers";

export default function Hello() {
  return (
    <Layout
      title="Signature debugger"
      description="A debugger to help you understand how to validate signatures"
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          marginTop: "20px",
          textAlign: "center",
        }}
      >
        <h2>Signature Validation Debugger</h2>
        <p>
          Enter signer address to see if the address is a EAO or a smart
          contract and what Standarts (like ERC-1271, ERC-6492, etc.) it uses if
          the address is a smart contract.
        </p>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            maxWidth: "1200px",
            minWidth: "360px",
            justifyContent: "start",
            alignItems: "center",
            fontSize: "20px",
            padding: "20px",
          }}
        >
          <div style={{ width: "100%" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <h3>Signer address:</h3>
              <input
                placeholder="0x..."
                style={{ padding: "10px", width: "90%" }}
                name="signerAddress"
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
