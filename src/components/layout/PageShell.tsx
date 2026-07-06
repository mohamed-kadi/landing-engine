import type { ReactNode } from 'react';
import { Footer } from './Footer';
import { Navbar } from './Navbar';

type PageShellProps = {
  children: ReactNode;
};

export function PageShell({ children }: PageShellProps) {
  return (
    <>
      <Navbar />
      <main className="bg-white text-zinc-950 pb-28 lg:pb-0">{children}</main>
      <Footer />
    </>
  );
}
