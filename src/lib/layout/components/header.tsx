import { ThemeToggle } from '@/lib/components/theme-toggle';
import { SidebarTrigger } from '@/components/ui/sidebar';

export const Header = () => {
  return (
    <header className="bg-base-100/80 sticky top-0 z-10 w-full backdrop-blur-md">
      <section className="flex items-center justify-between py-2 px-4 w-full">
        <div className="justify-start">
          <SidebarTrigger />
        </div>
      </section>
    </header>
  );
};
