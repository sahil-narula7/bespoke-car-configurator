import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getOwnerSessionCookieName, verifyOwnerSessionToken } from "@/lib/admin-auth";
import { getSubmissions } from "@/lib/excel";

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

export default async function OwnerDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(getOwnerSessionCookieName())?.value;

  if (!verifyOwnerSessionToken(token)) {
    redirect("/owner/login");
  }

  const submissions = getSubmissions().sort((a, b) =>
    String(b.submittedAt || "").localeCompare(String(a.submittedAt || "")),
  );

  return (
    <main className="min-h-screen bg-site px-4 py-8 text-stone-100 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-accent/80">Private Dashboard</p>
            <h1 className="font-display mt-3 text-4xl">Commission Submissions</h1>
            <p className="mt-2 text-sm text-stone-300">Total records: {submissions.length}</p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/api/admin/submissions"
              className="rounded-xl border border-accent/60 bg-accent/10 px-4 py-2 text-xs uppercase tracking-[0.15em] text-accent transition hover:bg-accent/20"
            >
              Download Today Excel
            </Link>
            <form action="/api/admin/logout" method="post">
              <button
                type="submit"
                className="rounded-xl border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.15em] text-stone-200 transition hover:bg-white/10"
              >
                Logout
              </button>
            </form>
          </div>
        </header>

        <section className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-black/30">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10 text-left text-sm">
              <thead className="bg-white/5 text-xs uppercase tracking-[0.12em] text-stone-300">
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
              <tbody className="divide-y divide-white/10">
                {submissions.map((submission, index) => (
                  <tr key={`${submission.email}-${submission.submittedAt}-${index}`}>
                    <td className="px-4 py-3 text-stone-300">{formatDate(submission.submittedAt)}</td>
                    <td className="px-4 py-3">{submission.name || "-"}</td>
                    <td className="px-4 py-3">{submission.email || "-"}</td>
                    <td className="px-4 py-3">{submission.phone || "-"}</td>
                    <td className="px-4 py-3">{submission.desiredCar || "-"}</td>
                    <td className="px-4 py-3">{submission.investmentRange || "-"}</td>
                    <td className="max-w-sm px-4 py-3 text-stone-300">{submission.message || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
