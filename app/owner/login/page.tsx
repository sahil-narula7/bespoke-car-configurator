"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function OwnerLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("owner");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = useMemo(() => username.trim() && password, [username, password]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const body = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(body.error || "Unable to login");
        return;
      }

      router.push("/owner");
      router.refresh();
    } catch {
      setError("Unable to login right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-site text-stone-100 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black/30 p-8 backdrop-blur">
        <p className="text-xs uppercase tracking-[0.35em] text-accent/80">Private Access</p>
        <h1 className="font-display mt-3 text-4xl leading-tight">Owner Login</h1>
        <p className="mt-3 text-sm text-stone-300">
          Sign in to access commission submissions and download Excel files.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-stone-300">
              Username
            </span>
            <input
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 outline-none transition focus:border-accent/60"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-stone-300">
              Password
            </span>
            <input
              type="password"
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 outline-none transition focus:border-accent/60"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          {error ? <p className="text-sm text-rose-300">{error}</p> : null}

          <button
            type="submit"
            disabled={!canSubmit || loading}
            className="w-full rounded-xl border border-accent/60 bg-accent/10 px-4 py-3 text-sm uppercase tracking-[0.18em] text-accent transition hover:bg-accent/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
