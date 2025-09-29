"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";

import styles from "../styles/WalletButton.module.css";

const connector = injected({ shimDisconnect: true });

export function WalletButton() {
  const { address, isConnected } = useAccount();
  const { connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    const short = `${address.slice(0, 6)}…${address.slice(-4)}`;
    return (
      <button className={styles.button} onClick={() => disconnect()}>
        {short} · Disconnect
      </button>
    );
  }

  return (
    <button className={styles.button} onClick={() => connect({ connector })} disabled={isPending}>
      {isPending ? "Connecting…" : "Connect Wallet"}
    </button>
  );
}
