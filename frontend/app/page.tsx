"use client";

import { useMemo } from "react";
import { useReadContract } from "wagmi";

import styles from "../styles/Home.module.css";
import { contractConfig } from "../lib/contracts";
import { ElectionSummary } from "../components/ElectionSummary";

export default function HomePage() {
  const { data, isLoading } = useReadContract({
    ...contractConfig,
    functionName: "electionCount"
  });

  const electionIds = useMemo(() => {
    if (!data) return [];
    const total = Number(data);
    return Array.from({ length: total }, (_, index) => index);
  }, [data]);

  return (
    <div>
      <h1 className={styles.heading}>Active Elections</h1>
      {isLoading && <p>Loading elections…</p>}
      {!isLoading && electionIds.length === 0 ? (
        <div className={styles.empty}>No elections yet. Admins can create one from the admin panel.</div>
      ) : (
        electionIds.map((id) => <ElectionSummary key={id} id={id} />)
      )}
    </div>
  );
}
