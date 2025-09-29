"use client";

import { useEffect, useMemo, useState } from "react";
import { useAccount, usePublicClient, useReadContract, useWaitForTransactionReceipt, useWatchContractEvent, useWriteContract } from "wagmi";

import styles from "../../../styles/ElectionDetail.module.css";
import { contractAbi, contractAddress, contractConfig } from "../../../lib/contracts";

type PageProps = {
  params: { id: string };
};

type Candidate = {
  index: number;
  name: string;
  votes: bigint;
};

function formatStatus(active: boolean, ended: boolean) {
  if (ended) return "Ended";
  if (active) return "Active";
  return "Not started";
}

export default function ElectionDetailPage({ params }: PageProps) {
  const [idValid, electionKey] = useMemo(() => {
    try {
      const key = BigInt(params.id);
      return [true, key] as const;
    } catch {
      return [false, 0n] as const;
    }
  }, [params.id]);

  const electionId = Number(electionKey);

  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();

  const electionQuery = useReadContract({
    ...contractConfig,
    functionName: "getElection",
    args: [electionKey],
    query: { enabled: idValid }
  });

  const candidatesCountQuery = useReadContract({
    ...contractConfig,
    functionName: "getCandidatesCount",
    args: [electionKey],
    query: { enabled: idValid }
  });

  const hasVotedQuery = useReadContract({
    ...contractConfig,
    functionName: "hasVoted",
    args: [electionKey, (address ?? "0x0000000000000000000000000000000000000000") as `0x${string}`],
    query: { enabled: Boolean(address) && idValid }
  });

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentHash, setCurrentHash] = useState<`0x${string}` | undefined>();
  const [refreshCounter, setRefreshCounter] = useState(0);

  const { writeContractAsync, isPending } = useWriteContract();
  const { data: receipt, isLoading: isConfirming } = useWaitForTransactionReceipt({ hash: currentHash });

  useEffect(() => {
    if (!publicClient || !candidatesCountQuery.data || !idValid) return;
    const loadCandidates = async () => {
      const count = Number(candidatesCountQuery.data);
      const entries = await Promise.all(
        Array.from({ length: count }, async (_, index) => {
          const [name, votes] = (await publicClient.readContract({
            address: contractAddress,
            abi: contractAbi,
            functionName: "getCandidate",
            args: [electionKey, BigInt(index)]
          })) as [string, bigint];
          return { index, name, votes } satisfies Candidate;
        })
      );
      setCandidates(entries);
    };

    loadCandidates().catch((error) => console.error("Failed to load candidates", error));
  }, [publicClient, candidatesCountQuery.data, electionKey, refreshCounter]);

  useEffect(() => {
    if (receipt) {
      setStatusMessage("Transaction confirmed.");
      setCurrentHash(undefined);
      setRefreshCounter((prev) => prev + 1);
      hasVotedQuery.refetch?.();
      electionQuery.refetch?.();
      candidatesCountQuery.refetch?.();
    }
  }, [receipt, electionQuery, candidatesCountQuery, hasVotedQuery]);

  const electionData = electionQuery.data as [string, boolean, boolean] | undefined;
  const candidateCount = Number(candidatesCountQuery.data ?? 0);
  const hasVoted = (hasVotedQuery.data as boolean | undefined) ?? false;

  useWatchContractEvent({
    address: contractAddress,
    abi: contractAbi,
    eventName: "VoteCast",
    args: { electionId: electionKey },
    enabled: idValid,
    onLogs: () => setRefreshCounter((prev) => prev + 1)
  });

  useWatchContractEvent({
    address: contractAddress,
    abi: contractAbi,
    eventName: "ElectionStarted",
    args: { electionId: electionKey },
    enabled: idValid,
    onLogs: () => electionQuery.refetch?.()
  });

  useWatchContractEvent({
    address: contractAddress,
    abi: contractAbi,
    eventName: "ElectionEnded",
    args: { electionId: electionKey },
    enabled: idValid,
    onLogs: () => electionQuery.refetch?.()
  });

  const disabled = !isConnected || hasVoted || isPending || isConfirming;

  const handleVote = async () => {
    setErrorMessage(null);
    if (!isConnected) {
      setErrorMessage("Connect your wallet to vote.");
      return;
    }
    if (selectedCandidate === null) {
      setErrorMessage("Please select a candidate.");
      return;
    }

    try {
      setStatusMessage("Waiting for signature…");
      const hash = await writeContractAsync({
        ...contractConfig,
        functionName: "vote",
        args: [electionKey, BigInt(selectedCandidate)]
      });
      setCurrentHash(hash);
      setStatusMessage("Transaction submitted. Waiting for confirmation…");
    } catch (err) {
      setStatusMessage(null);
      setErrorMessage((err as Error).message);
    }
  };

  if (!idValid) {
    return <p>Invalid election id.</p>;
  }

  if (electionQuery.error) {
    return <p>Election not found.</p>;
  }

  if (!electionData) {
    return <p>Loading election…</p>;
  }

  const [title, active, ended] = electionData;

  return (
    <div>
      <h1 className={styles.heading}>{title}</h1>
      <p className={styles.status}>Status: {formatStatus(active, ended)}</p>

      <ul className={styles.candidateList}>
        {candidates.map((candidate) => (
          <li key={candidate.index} className={styles.candidateItem}>
            <div className={styles.candidateHeader}>
              <span>{candidate.name}</span>
              <span className={styles.voteCount}>{candidate.votes.toString()} votes</span>
            </div>
            {active && !ended && (
              <label>
                <input
                  type="radio"
                  name="candidate"
                  value={candidate.index}
                  checked={selectedCandidate === candidate.index}
                  onChange={() => setSelectedCandidate(candidate.index)}
                  disabled={disabled}
                />
                <span style={{ marginLeft: "0.5rem" }}>Select</span>
              </label>
            )}
          </li>
        ))}
      </ul>

      {candidateCount === 0 && <p>No candidates configured.</p>}

      {active && !ended && (
        <div className={styles.voteForm}>
          <button className={styles.voteButton} onClick={handleVote} disabled={disabled}>
            {isPending || isConfirming ? "Processing…" : hasVoted ? "Vote cast" : "Submit vote"}
          </button>
          {!isConnected && <span>Please connect your wallet to vote.</span>}
          {hasVoted && <span>You already voted in this election.</span>}
        </div>
      )}

      {statusMessage && <div className={styles.statusMessage}>{statusMessage}</div>}
      {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
    </div>
  );
}
