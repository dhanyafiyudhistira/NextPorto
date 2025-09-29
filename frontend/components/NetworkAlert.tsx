"use client";

import { useAccount, useChainId, useSwitchChain } from "wagmi";

import layoutStyles from "../styles/Layout.module.css";
import styles from "../styles/NetworkAlert.module.css";
import { targetChain } from "../lib/chains";

export function NetworkAlert() {
  const { isConnected } = useAccount();
  const activeChainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();

  if (!isConnected) {
    return null;
  }

  if (activeChainId === targetChain.id) {
    return null;
  }

  return (
    <div className={layoutStyles.notice}>
      <span>
        Please switch to {targetChain.name} ({targetChain.id}).
      </span>
      <button
        className={styles.switch}
        onClick={() => switchChain({ chainId: targetChain.id })}
        disabled={isPending}
      >
        {isPending ? "Switching…" : "Switch network"}
      </button>
    </div>
  );
}
