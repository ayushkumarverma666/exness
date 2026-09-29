import { Logo } from "../Logo";
import { BRAND } from "../../lib/brand";

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col px-6 py-8 md:px-12">
        <Logo />
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
        <p className="text-xs text-dim">Demo accounts use virtual funds only. Leveraged trading carries a high level of risk.</p>
      </div>
      <div
        className="hidden border-l border-line lg:flex lg:flex-col lg:justify-end lg:p-12"
        style={{ background: "radial-gradient(80% 60% at 70% 20%, rgba(91,130,255,0.22), transparent 70%), #0d1118" }}
      >
        <blockquote className="max-w-md">
          <p className="text-2xl font-medium leading-snug">
            “Know your liquidation price before you enter. Every time.”
          </p>
          <footer className="mt-4 text-sm text-muted">The first rule of trading on {BRAND.name}</footer>
        </blockquote>
      </div>
    </div>
  );
}

export function Field({
  label,
  hint,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-muted">{label}</span>
      <input
        {...props}
        className="w-full rounded-md border border-line-2 bg-panel px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-dim focus:border-accent"
      />
      {hint && <span className="mt-1 block text-xs text-dim">{hint}</span>}
    </label>
  );
}
