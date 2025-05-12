import { AppSidebar } from "../../components/app-sidebar"
import { SidebarProvider } from "../../components/ui/sidebar"
import { ThemeToggle } from "../../components/theme-toggle"

export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 border-b flex items-center justify-end px-4 gap-4">
            <ThemeToggle />
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
