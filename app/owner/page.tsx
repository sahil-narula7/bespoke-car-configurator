import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getOwnerSessionCookieName, verifyOwnerSessionToken } from "@/lib/admin-auth";
import OwnerDashboardClient from "./owner-dashboard-client";

export default async function OwnerDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(getOwnerSessionCookieName())?.value;

  if (!verifyOwnerSessionToken(token)) {
    redirect("/owner/login");
  }

  return (
    <main className="min-h-screen bg-site px-4 py-8 text-stone-100 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-accent/80">Private Dashboard</p>
            <h1 className="font-display mt-3 text-4xl">Commission Submissions</h1>
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

        <OwnerDashboardClient />
      </div>
    </main>
  );
}
