import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar/Sidebar";
import { useSidebarStore } from "@/store/useSidebarStore";
import {
  createFileRoute,  
  Outlet,
  redirect,
} from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboardLayout")({
  beforeLoad: async ({ context }) => {
    if (!context.isAuthenticated) {
      throw redirect({
        to: "/login",
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { mobileOpen, setMobileOpen } = useSidebarStore();

  return (
    <div className="dashboard_layout">
      
      <Sidebar />

      
      <div
        className={`
          fixed inset-0 z-40 transition-transform duration-300 ease-in-out
          lg:hidden
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          bg-gray-900 text-white w-64
        `}
      >
        <div className="p-4">
          <button className="mb-4" onClick={() => setMobileOpen(false)}>
            Close
          </button>
          <nav className="space-y-4">
            <div className="flex items-center gap-2">
              <i>🏠</i> <span>Home</span>
            </div>
            <div className="flex items-center gap-2">
              <i>📁</i> <span>Projects</span>
            </div>
            <div className="flex items-center gap-2">
              <i>⚙️</i> <span>Settings</span>
            </div>
          </nav>
        </div>
      </div>

      {/* Backdrop for mobile sidebar */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-auto flex flex-col z-10 relative py-4 px-8 overflow-x-hidden">
        <Header />

        <div className="flex-1 overflow-y-visible mt-0 ">
          <Outlet />
        </div>

        <footer className="footer text-sm">
          Made with ❤ by{" "}
          <a
            href="https://www.shambashib.in/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Shambashib Majumdar
          </a>
        </footer>
      </main>
    </div>
  );
}
