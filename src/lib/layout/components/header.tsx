import { ThemeToggle } from '@/lib/components/theme-toggle';
import { SidebarTrigger } from '@/components/ui/sidebar';

export const Header = () => {
  return (
    <header className="bg-base-100/80 sticky top-0 z-10 w-full backdrop-blur-md">
      <section className="flex items-center justify-between py-2 px-4 w-full">
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </section>
    </header>
  );
};

export const MobileHeader = () => {
  return (
    <div className="p-2 md:hidden sticky w-full flex justify-between">
      <SidebarTrigger className="bg-base-100/80 text-base-content hover:bg-base-200/80" />
      <h1 className="text-xl px-2">SF.gov BizDash</h1>
      <ThemeToggle />
    </div>
  );
};
