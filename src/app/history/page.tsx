'use client';

/**
 * History Page
 *
 * Displays a table of past predictions with filtering and CSV export.
 * Features:
 * - Paginated table of predictions
 * - Filter by date range
 * - Filter by predicted digit
 * - Download history as CSV
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

interface Prediction {
  id: number;
  createdAt: string;
  inputLabel: string | null;
  predictedDigit: number;
  topProbabilities: {
    digit: number;
    probability: number;
  }[];
  allProbabilities: { [key: string]: number };
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function HistoryPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [filterDigit, setFilterDigit] = useState<string>('');
  const [filterStartDate, setFilterStartDate] = useState<string>('');
  const [filterEndDate, setFilterEndDate] = useState<string>('');

  // Fetch predictions
  const fetchPredictions = async (page: number = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });

      if (filterDigit !== '') {
        params.append('digit', filterDigit);
      }
      if (filterStartDate) {
        params.append('startDate', filterStartDate);
      }
      if (filterEndDate) {
        params.append('endDate', filterEndDate);
      }

      const response = await fetch(`/api/history?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch history');
      }

      const result = await response.json();

      setPredictions(result.data);
      setPagination(result.pagination);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load history');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load and reload on filter changes
  useEffect(() => {
    fetchPredictions(1);
  }, [filterDigit, filterStartDate, filterEndDate]);

  // Handle CSV export
  const handleExportCSV = async () => {
    try {
      const params = new URLSearchParams();

      if (filterDigit !== '') {
        params.append('digit', filterDigit);
      }
      if (filterStartDate) {
        params.append('startDate', filterStartDate);
      }
      if (filterEndDate) {
        params.append('endDate', filterEndDate);
      }

      const url = `/api/history/export?${params.toString()}`;

      // Trigger download
      window.location.href = url;
    } catch (err) {
      console.error('Export error:', err);
      alert('Failed to export CSV');
    }
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.title}>Prediction History</h1>
        <p className={styles.subtitle}>
          View and export past predictions
        </p>
        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>Home</Link>
          <Link href="/history" className={styles.navLink}>History</Link>
        </nav>
      </header>

      <main className={styles.main}>
        {/* Filters */}
        <section className={styles.filters}>
          <h2 className={styles.filtersTitle}>Filters</h2>

          <div className={styles.filterGrid}>
            <div className={styles.filterGroup}>
              <label htmlFor="digit" className={styles.filterLabel}>
                Predicted Digit:
              </label>
              <select
                id="digit"
                value={filterDigit}
                onChange={(e) => setFilterDigit(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="">All</option>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                  <option key={digit} value={digit}>
                    {digit}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label htmlFor="startDate" className={styles.filterLabel}>
                Start Date:
              </label>
              <input
                type="date"
                id="startDate"
                value={filterStartDate}
                onChange={(e) => setFilterStartDate(e.target.value)}
                className={styles.filterInput}
              />
            </div>

            <div className={styles.filterGroup}>
              <label htmlFor="endDate" className={styles.filterLabel}>
                End Date:
              </label>
              <input
                type="date"
                id="endDate"
                value={filterEndDate}
                onChange={(e) => setFilterEndDate(e.target.value)}
                className={styles.filterInput}
              />
            </div>

            <button onClick={handleExportCSV} className={styles.exportButton}>
              Download CSV
            </button>
          </div>
        </section>

        {/* Results summary */}
        <div className={styles.summary}>
          <span>Total predictions: {pagination.total}</span>
          <span>Page {pagination.page} of {pagination.totalPages || 1}</span>
        </div>

        {/* Error message */}
        {error && (
          <div className={styles.error}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className={styles.loading}>Loading...</div>
        )}

        {/* Predictions table */}
        {!isLoading && predictions.length > 0 && (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Timestamp</th>
                  <th>Predicted Digit</th>
                  <th>Top 3 Probabilities</th>
                  <th>Input Label</th>
                </tr>
              </thead>
              <tbody>
                {predictions.map((pred) => (
                  <tr key={pred.id}>
                    <td>{pred.id}</td>
                    <td>{formatDate(pred.createdAt)}</td>
                    <td className={styles.digitCell}>{pred.predictedDigit}</td>
                    <td className={styles.probabilities}>
                      {pred.topProbabilities.map((p, idx) => (
                        <span key={idx} className={styles.probability}>
                          <strong>{p.digit}</strong> ({(p.probability * 100).toFixed(1)}%)
                        </span>
                      ))}
                    </td>
                    <td>{pred.inputLabel || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && predictions.length === 0 && (
          <div className={styles.empty}>
            <p>No predictions found. Try adjusting your filters or make some predictions first!</p>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              onClick={() => fetchPredictions(pagination.page - 1)}
              disabled={pagination.page === 1}
              className={styles.paginationButton}
            >
              Previous
            </button>

            <span className={styles.pageInfo}>
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <button
              onClick={() => fetchPredictions(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className={styles.paginationButton}
            >
              Next
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>Built with Next.js, TensorFlow.js, and PostgreSQL</p>
      </footer>
    </div>
  );
}
