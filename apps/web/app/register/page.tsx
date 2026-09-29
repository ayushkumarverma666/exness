"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { AuthShell, Field } from "../components/site/AuthShell";

function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accepted, setAccepted] = useState(false);
  const { register } = useAuth();
  const router = useRouter();
  const next = useSearchParams().get("next") || "/trade";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    register.mutate({ name, email, password }, { onSuccess: () => router.push(next) });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label="Full name" autoComplete="name" required minLength={2} value={name} onChange={(e) => setName(e.target.value)} />
      <Field label="Email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      <Field
        label="Password"
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
        hint="At least 8 characters, including a letter and a number."
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <label className="flex items-start gap-2 text-xs text-muted">
        <input type="checkbox" className="mt-0.5 accent-[#5b82ff]" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} />
        <span>
          I understand that leveraged trading is high risk and that this is a demo account funded with virtual USDC.{" "}
          <Link href="/help#risk" className="text-accent">Risk disclosure</Link>
        </span>
      </label>
      <button
        disabled={register.isPending || !accepted}
        className="w-full rounded-md bg-accent py-2.5 text-sm font-medium text-white hover:bg-accent/90 disabled:opacity-50"
      >
        {register.isPending ? "Creating account…" : "Create account"}
      </button>
      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href={`/login?next=${encodeURIComponent(next)}`} className="text-accent">
          Log in
        </Link>
      </p>
    </form>
  );
}

export default function RegisterPage() {
  return (
    <AuthShell title="Open your account" subtitle="Get 10,000 USDC in demo funds and start trading in under a minute.">
      <Suspense>
        <RegisterForm />
      </Suspense>
    </AuthShell>
  );
}
