import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';

interface SiteShellProps {
  children: React.ReactNode;
  /** Home page: header floats transparently over the hero. */
  overlayHeader?: boolean;
}

/** Wrapper for every public page: navy theme, Plex fonts, header + footer. */
export default function SiteShell({ children, overlayHeader = false }: SiteShellProps) {
  return (
    <div className="min-h-screen bg-navy-950 font-plex text-base leading-relaxed text-navy-text">
      <SiteHeader overlay={overlayHeader} />
      <main id="main">{children}</main>
      <SiteFooter />
    </div>
  );
}
