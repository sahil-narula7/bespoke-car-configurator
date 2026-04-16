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
    <main className="min-h-screen bg-site px-4 py-8 text-[#1b1510] sm:px-6 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-4 border-b border-[#2f241d]/15 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#935243]">Private Dashboard</p>
            <h1 className="font-display mt-3 text-4xl text-[#1a1511]">Commission Submissions</h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/api/admin/submissions"
              className="rounded-xl border border-[#b15a49]/55 bg-[#a03d2e] px-4 py-2 text-xs uppercase tracking-[0.15em] text-[#fff4ea] transition hover:bg-[#8c3428]"
            >
              Download Today Excel
            </Link>
            <form action="/api/admin/logout" method="post">
              <button
                type="submit"
                className="rounded-xl border border-[#2f241d]/25 bg-[#f7efe2] px-4 py-2 text-xs uppercase tracking-[0.15em] text-[#2e231b] transition hover:bg-[#f1e5d5]"
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
