"use client";

import Link from "next/link";
import { useReadContract } from "wagmi";

import styles from "../styles/ElectionSummary.module.css";
import { contractConfig } from "../lib/contracts";

type Props = {
  id: number;
};

function statusLabel(active: boolean, ended: boolean) {
  if (ended) return "Ended";
  if (active) return "Active";
  return "Not started";
}

export function ElectionSummary({ id }: Props) {
  const { data, isLoading, error } = useReadContract({
    ...contractConfig,
    functionName: "getElection",
    args: [BigInt(id)]
  });

  if (isLoading) {
    return (
      <div className={styles.card}>
        <p>Loading election #{id}…</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={styles.card}>
        <p>Unable to fetch election #{id}</p>
      </div>
    );
  }

  const [title, active, ended] = data as [string, boolean, boolean];

  return (
    <div className={styles.card}>
      <div>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.meta}>Status: {statusLabel(active, ended)}</p>
      </div>
      <Link className={styles.link} href={`/election/${id}`}>
        View election →
      </Link>
    </div>
  );
}
