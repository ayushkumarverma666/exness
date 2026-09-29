"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { AuthShell, Field } from "../components/site/AuthShell";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const router = useRouter();
  const next = useSearchParams().get("next") || "/trade";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate({ email, password }, { onSuccess: () => router.push(next) });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label="Email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      <Field
        label="Password"
        type="password"
        autoComplete="current-password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        disabled={login.isPending}
        className="w-full rounded-md bg-accent py-2.5 text-sm font-medium text-white hover:bg-accent/90 disabled:opacity-60"
      >
        {login.isPending ? "Signing in…" : "Log in"}
      </button>
      <p className="text-center text-sm text-muted">
        New here?{" "}
        <Link href={`/register?next=${encodeURIComponent(next)}`} className="text-accent">
          Open a free account
        </Link>
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <AuthShell title="Welcome back" subtitle="Log in to your trading account.">
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
