import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/useAuth"
import { useLocation } from "react-router"

export function SiteHeader() {

  let location = useLocation();
  const { user, onLogout } = useAuth();

  const getPageTitle = () => {
    const path = location.pathname.split('/').filter(Boolean).pop() || 'dashboard';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <header
      className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <h1 className="text-base font-medium">{getPageTitle()}</h1>
        <div className="ml-auto flex items-center gap-2">
          {user && (
            <>
              <span className="text-sm text-muted-foreground">
                {user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.email}
              </span>
              <Button variant="ghost" size="sm" onClick={onLogout}>
                Logout
              </Button>
            </>
          )}
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a
              href="https://github.com/shadcn-ui/ui/tree/main/apps/v4/app/(examples)/dashboard"
              rel="noopener noreferrer"
              target="_blank"
              className="dark:text-foreground">
              GitHub
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
