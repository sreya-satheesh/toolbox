
'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { Wrench } from 'lucide-react';
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/SidebarNav';
import { ThemeToggle } from '@/components/ThemeToggle';

function MobileHeader() {
    const { isMobile } = useSidebar();

    if (!isMobile) {
        return null;
    }

    return (
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <SidebarTrigger className="md:hidden" />
             <Link href="/" className="flex items-center gap-2" aria-label="Toolbox Home">
                <Wrench className="size-7 text-primary" />
                <h1 className="text-lg font-semibold">
                  Toolbox
                </h1>
              </Link>
            <div className="ml-auto">
                 <ThemeToggle />
            </div>
        </header>
    );
}


export function AppContainer({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-svh">
      <SidebarProvider defaultOpen={true}>
          <div className="flex flex-1 flex-col md:flex-row">
              <Sidebar collapsible="icon">
                <SidebarNav />
              </Sidebar>
              <div className="flex flex-1 flex-col">
                <MobileHeader />
                <SidebarInset>{children}</SidebarInset>
              </div>
          </div>
      </SidebarProvider>
      <footer className="w-full p-4 text-right text-sm text-muted-foreground">
        Built with ❤️ by Sreya
      </footer>
    </div>
  );
}
