"use client";

import { useEffect, useMemo, useState } from "react";

type Submission = {
  submittedAt: string;
  name: string;
  email: string;
  phone: string;
  desiredCar: string;
  investmentRange: string;
  message: string;
};

type ApiResponse = {
  success: boolean;
  submissions?: Submission[];
  error?: string;
};

function formatDate(iso: string): string {
  if (!iso) {
    return "-";
  }

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function OwnerDashboardClient() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const totalRecords = useMemo(() => submissions.length, [submissions]);

  useEffect(() => {
    let active = true;

    async function loadSubmissions() {
      try {
        const response = await fetch("/api/admin/submissions?format=json", {
          credentials: "include",
        });
        const body = (await response.json()) as ApiResponse;

        if (!active) {
          return;
        }

        if (!response.ok) {
          setError(body.error || "Unable to load submissions.");
          setSubmissions([]);
          return;
        }

        setSubmissions((body.submissions || []).sort((a, b) =>
          String(b.submittedAt || "").localeCompare(String(a.submittedAt || "")),
        ));
      } catch {
        if (active) {
          setError("Unable to load submissions right now.");
          setSubmissions([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadSubmissions();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-[#2f241d]/20 bg-[linear-gradient(170deg,#fcf7ef,#f1e5d7)] panel-glow">
      <div className="border-b border-[#2f241d]/15 px-5 py-4 text-sm text-[#66574b]">
        {loading ? "Loading submissions..." : `Total records: ${totalRecords}`}
      </div>

      {error ? <div className="px-5 py-4 text-sm text-rose-300">{error}</div> : null}

      {!loading && !error && submissions.length === 0 ? (
        <div className="px-5 py-10 text-sm text-[#66574b]">No submissions yet.</div>
      ) : null}

      {!loading && !error && submissions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#2f241d]/10 text-left text-sm text-[#231912]">
            <thead className="bg-[#f6eddf] text-xs uppercase tracking-[0.12em] text-[#6a5a4d]">
              <tr>
                <th className="px-4 py-3">Submitted</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Desired Car</th>
                <th className="px-4 py-3">Investment Range</th>
                <th className="px-4 py-3">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2f241d]/10">
              {submissions.map((submission, index) => (
                <tr key={`${submission.email}-${submission.submittedAt}-${index}`}>
                  <td className="px-4 py-3 text-[#705f51]">{formatDate(submission.submittedAt)}</td>
                  <td className="px-4 py-3">{submission.name || "-"}</td>
                  <td className="px-4 py-3">{submission.email || "-"}</td>
                  <td className="px-4 py-3">{submission.phone || "-"}</td>
                  <td className="px-4 py-3">{submission.desiredCar || "-"}</td>
                  <td className="px-4 py-3">{submission.investmentRange || "-"}</td>
                  <td className="max-w-sm px-4 py-3 text-[#6f5f52]">{submission.message || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}
