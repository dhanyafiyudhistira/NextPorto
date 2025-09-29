"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";

import styles from "../../styles/Admin.module.css";
import { contractConfig } from "../../lib/contracts";

export default function AdminPage() {
  const { address } = useAccount();
  const { data: ownerAddress } = useReadContract({
    ...contractConfig,
    functionName: "owner"
  });

  const isOwner = useMemo(() => {
    if (!address || !ownerAddress) return false;
    return address.toLowerCase() === (ownerAddress as string).toLowerCase();
  }, [address, ownerAddress]);

  const [title, setTitle] = useState("");
  const [candidateInputs, setCandidateInputs] = useState<string[]>(["", ""]);
  const [startElectionId, setStartElectionId] = useState("");
  const [endElectionId, setEndElectionId] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentHash, setCurrentHash] = useState<`0x${string}` | undefined>();

  const { writeContractAsync, isPending } = useWriteContract();
  const { data: receipt, isLoading: isConfirming } = useWaitForTransactionReceipt({ hash: currentHash });

  useEffect(() => {
    if (currentHash) {
      setStatus("Transaction submitted. Waiting for confirmation…");
    }
  }, [currentHash]);

  useEffect(() => {
    if (receipt) {
      setStatus("Transaction confirmed.");
      setCurrentHash(undefined);
    }
  }, [receipt]);

  const disabled = !isOwner || isPending || isConfirming;

  const handleAddCandidate = () => {
    setCandidateInputs((prev) => [...prev, ""]);
  };

  const handleCandidateChange = (index: number, value: string) => {
    setCandidateInputs((prev) => prev.map((entry, i) => (i === index ? value : entry)));
  };

  const resetForm = () => {
    setTitle("");
    setCandidateInputs(["", ""]);
  };

  const handleCreate = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!isOwner) {
      setError("Only the contract owner can create elections.");
      return;
    }

    const trimmedTitle = title.trim();
    const candidates = candidateInputs.map((name) => name.trim()).filter((name) => name.length > 0);

    if (!trimmedTitle) {
      setError("Title is required.");
      return;
    }

    if (candidates.length < 2) {
      setError("Please provide at least two candidate names.");
      return;
    }

    try {
      setStatus("Waiting for signature…");
      const hash = await writeContractAsync({
        ...contractConfig,
        functionName: "createElection",
        args: [trimmedTitle, candidates]
      });
      setCurrentHash(hash);
      resetForm();
    } catch (err) {
      setStatus(null);
      setError((err as Error).message);
    }
  };

  const handleStart = async () => {
    setError(null);
    if (!isOwner) {
      setError("Only the contract owner can start elections.");
      return;
    }
    if (!startElectionId) {
      setError("Provide an election id to start.");
      return;
    }
    try {
      setStatus("Waiting for signature…");
      const hash = await writeContractAsync({
        ...contractConfig,
        functionName: "startElection",
        args: [BigInt(startElectionId)]
      });
      setCurrentHash(hash);
    } catch (err) {
      setStatus(null);
      setError((err as Error).message);
    }
  };

  const handleEnd = async () => {
    setError(null);
    if (!isOwner) {
      setError("Only the contract owner can end elections.");
      return;
    }
    if (!endElectionId) {
      setError("Provide an election id to end.");
      return;
    }
    try {
      setStatus("Waiting for signature…");
      const hash = await writeContractAsync({
        ...contractConfig,
        functionName: "endElection",
        args: [BigInt(endElectionId)]
      });
      setCurrentHash(hash);
    } catch (err) {
      setStatus(null);
      setError((err as Error).message);
    }
  };

  return (
    <div>
      <h1 className={styles.heading}>Admin Panel</h1>
      {!isOwner && (
        <div className={styles.notice}>
          Connected account is not the owner. You can view data but actions are disabled.
        </div>
      )}

      <form className={styles.formSection} onSubmit={handleCreate}>
        <h2>Create Election</h2>
        <div className={styles.field}>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Ketua OSIS 2024"
            disabled={disabled}
          />
        </div>

        <div className={styles.field}>
          <label>Candidate names</label>
          {candidateInputs.map((value, index) => (
            <div key={index} className={styles.candidateRow}>
              <input
                value={value}
                onChange={(event) => handleCandidateChange(index, event.target.value)}
                placeholder={`Candidate #${index + 1}`}
                disabled={disabled}
              />
            </div>
          ))}
          <button type="button" className={styles.secondaryButton} onClick={handleAddCandidate} disabled={disabled}>
            + Add candidate
          </button>
        </div>

        <button type="submit" className={styles.button} disabled={disabled}>
          Create election
        </button>
      </form>

      <div className={styles.formSection}>
        <h2>Start Election</h2>
        <div className={styles.field}>
          <label htmlFor="startId">Election id</label>
          <input
            id="startId"
            value={startElectionId}
            onChange={(event) => setStartElectionId(event.target.value)}
            placeholder="0"
            disabled={disabled}
          />
        </div>
        <button className={styles.button} onClick={handleStart} disabled={disabled}>
          Start election
        </button>
      </div>

      <div className={styles.formSection}>
        <h2>End Election</h2>
        <div className={styles.field}>
          <label htmlFor="endId">Election id</label>
          <input
            id="endId"
            value={endElectionId}
            onChange={(event) => setEndElectionId(event.target.value)}
            placeholder="0"
            disabled={disabled}
          />
        </div>
        <button className={styles.button} onClick={handleEnd} disabled={disabled}>
          End election
        </button>
      </div>

      {status && <div className={styles.status}>{status}</div>}
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}
