import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';

interface SiteShellProps {
  children: React.ReactNode;
}

/** Wrapper for every public page: navy theme, Plex fonts, header + footer. */
export default function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="min-h-screen bg-navy-950 font-plex text-base leading-relaxed text-navy-text">
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
    </div>
  );
}
