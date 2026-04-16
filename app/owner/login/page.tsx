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
    <main className="flex min-h-screen items-center justify-center bg-site px-6 py-12 text-[#efe4d1]">
      <div className="w-full max-w-md rounded-2xl border border-[#d9c6a1]/20 bg-[#101a29] p-8 panel-glow">
        <p className="text-xs uppercase tracking-[0.35em] text-[#d0b07a]">Private Access</p>
        <h1 className="font-display mt-3 text-4xl leading-tight text-[#efe4d1]">Owner Login</h1>
        <p className="mt-3 text-sm text-[#cdbca5]">
          Sign in to access commission submissions and download Excel files.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-[#d0b07a]">
              Username
            </span>
            <input
              className="w-full rounded-xl border border-[#d9c6a1]/18 bg-[#142234] px-4 py-3 text-[#efe4d1] outline-none transition focus:border-[#d0b07a]/70"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-[#d0b07a]">
              Password
            </span>
            <input
              type="password"
              className="w-full rounded-xl border border-[#d9c6a1]/18 bg-[#142234] px-4 py-3 text-[#efe4d1] outline-none transition focus:border-[#d0b07a]/70"
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
            className="w-full rounded-xl border border-[#b15a49]/55 bg-[#a03d2e] px-4 py-3 text-sm uppercase tracking-[0.18em] text-[#fff4ea] transition hover:bg-[#8c3428] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
