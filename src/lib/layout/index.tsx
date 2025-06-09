import type { ReactNode } from 'react';

import { ThemeProvider } from '@/lib/components/theme-provider';

import { Footer } from './components/footer';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from "@/components/app-sidebar";

type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  return (
    <SidebarProvider>
      <ThemeProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <div className="flex flex-col flex-1 w-full">
            <main className="flex-1 w-full">
              {children}
            </main>
            <Footer />
          </div>
        </div>
      </ThemeProvider>
    </SidebarProvider>
  );
};
