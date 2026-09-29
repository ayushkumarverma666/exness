import Link from "next/link";
import { Logo } from "../Logo";
import { BRAND } from "../../lib/brand";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-panel">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-4 md:px-6">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-muted">{BRAND.description}</p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-medium">Platform</h4>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link href="/trade" className="hover:text-fg">Web terminal</Link></li>
            <li><Link href="/markets" className="hover:text-fg">Markets &amp; specs</Link></li>
            <li><Link href="/register" className="hover:text-fg">Open an account</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-medium">Support</h4>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link href="/help" className="hover:text-fg">Help center</Link></li>
            <li><Link href="/help#risk" className="hover:text-fg">Risk disclosure</Link></li>
            <li><a href={`mailto:${BRAND.supportEmail}`} className="hover:text-fg">{BRAND.supportEmail}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-7xl px-4 py-6 text-xs leading-relaxed text-dim md:px-6">
          <strong className="text-muted">Risk warning:</strong> Trading leveraged products carries a high level of risk
          and can result in the loss of your entire margin. {BRAND.name} currently operates demo accounts funded with
          virtual USDC only; no real money is deposited, traded or withdrawn. Prices are streamed live from a public
          crypto exchange. © {new Date().getFullYear()} {BRAND.name}.
        </p>
      </div>
    </footer>
  );
}
