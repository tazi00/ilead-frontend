import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import {
  Funnel,
  House,
  Tags,
  MessageSquare,
  Activity,
  UserCircle,
  Users,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  Filter,
  Settings,
  Plug,
  Trash2,
  ChartArea,
  Package,
  LayoutTemplate,
  LucideBookTemplate,
} from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { FaEnvelope, FaSms, FaWhatsapp } from "react-icons/fa";

type Role = "Admin" | "Superadmin" | "User";

export type NavItem = {
  name: string;
  icon?: ReactNode;
  path?: string;
  roles?: Role[];
  subItems?: NavItem[];
};

interface SidebarMenuItemProps {
  item: NavItem;
  isCollapsed: boolean;
  depth?: number;
  currentUserRole?: Role;
}

export const navItems: NavItem[] = [
  { name: "Dashboard", icon: <House size={20} />, path: "/dashboard" },
  { name: "Lead", icon: <Filter size={20} />, path: "/lead" },
  {
    name: "Workspace Logs",
    icon: <MessageSquare size={20} />,
    path: "/workspace-logs",
    roles: ["Admin", "Superadmin"],
  },
  {
    name: "User Module",
    icon: <Users size={20} />,
    roles: ["Admin", "Superadmin"],
    subItems: [
      { name: "User List", path: "/users" },
      // { name: "Roles & Permissions", path: "/roles" },
      // { name: "Activity Log", path: "/user-activity" },
    ],
  },
  {
    name: "Customers",
    icon: <UserCircle size={20} />,
    path: "/customer",
    roles: ["Admin", "Superadmin"],
  },
  {
    name: "Integrations",
    icon: <Plug size={20} />,
    roles: ["Admin", "Superadmin"],
    subItems: [
      { name: "API Connections", path: "/third-party-integration" },
      // { name: "Webhooks", path: "/integrations/webhooks" },
      // { name: "Marketplace", path: "/integrations/marketplace" },
    ],
  },

  {
    name: "General Settings",
    icon: <Settings size={20} />,
    subItems: [
      {
        name: "Attributes",
        icon: <Funnel size={18} />,
        subItems: [
          {
            name: "Labels",
            icon: <Tags size={18} />,
            path: "/label",
            roles: ["Admin", "Superadmin"],
          },
          {
            name: "Status",
            icon: <TrendingUp size={18} />,
            path: "/status",
            roles: ["Admin", "Superadmin"],
          },
          {
            name: "Sources",
            icon: <Activity size={18} />,
            path: "/source",
            roles: ["Admin", "Superadmin"],
          },
        ],
      },
      {
        name: "Web Settings",
        icon: <Settings size={18} />,
        subItems: [
          {
            name: "Whatsapp Integration",
            icon: <Settings size={18} />,
            path: "/whatsapp-settings",
            roles: ["Admin", "Superadmin"],
          },
        ],
      },
      {
        name: "Leads Trash",
        icon: <Trash2 size={18} />,
        path: "/lead-trash",
      },
      {
        name: "Automation Rules",
        icon: <Funnel size={18} />,
        subItems: [
          {
            name: "Email Automation",
            icon: <FaEnvelope size={18} />,
            path: "/email-automation",
            roles: ["Admin", "Superadmin"],
          },
          {
            name: "SMS Automation",
            icon: <FaSms size={18} />,
            path: "/sms-automation",
            roles: ["Admin", "Superadmin"],
          },
          {
            name: "Whatsapp Automation",
            icon: <FaWhatsapp size={18} />,
            path: "/whatsapp-automation-rules",
            roles: ["Admin", "Superadmin"],
          },
        ],
      },
      {
        name: "Templates",
        icon: <LayoutTemplate size={18} />,
        subItems: [
          {
            name: "General Templates",
            icon: <LucideBookTemplate size={18} />,
            path: "/general-templates",
            roles: ["Admin", "Superadmin"],
          },
          {
            name: "Meta Templates",
            icon: <FaSms size={18} />,
            path: "/sms-automation",
            roles: ["Admin", "Superadmin"],
          },
        ],
      },
    ],
    roles: ["Admin", "Superadmin"],
  },
  {
    name: "Reports",
    icon: <ChartArea size={20} />,
    roles: ["Admin", "Superadmin"],
    path: "/report",
  },
  {
    name: "Packages",
    icon: <Package />,
    roles: ["Admin", "Superadmin"],
    path: "/add-package",
  },
];

function normalize(p?: string) {
  if (!p) return "";
  return p.endsWith("/") && p !== "/" ? p.slice(0, -1) : p;
}

function isPathActive(current: string, target?: string) {
  if (!target) return false;
  const a = normalize(current);
  const b = normalize(target);
  return a === b;
}

function isAnyDescendantActive(
  items: NavItem[] | undefined,
  current: string
): boolean {
  if (!items) return false;
  const a = normalize(current);
  return items.some(
    (si) =>
      (si.path &&
        (normalize(si.path) === a || a.startsWith(normalize(si.path) + "/"))) ||
      isAnyDescendantActive(si.subItems, current)
  );
}

export const SidebarMenuItem = ({
  item,
  isCollapsed,
  depth = 0,
  currentUserRole = "Admin",
}: SidebarMenuItemProps) => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Permission gate
  const hasPermission = !item.roles || item.roles.includes(currentUserRole);
  if (!hasPermission) return null;

  const hasSubItems = !!(item.subItems && item.subItems.length > 0);

  const isActive = isPathActive(currentPath, item.path);

  const subTreeActive = useMemo(
    () => isAnyDescendantActive(item.subItems, currentPath),
    [item.subItems, currentPath]
  );

  const shouldHighlight = isActive || subTreeActive;

  // Default-open if any descendant is active
  const [isOpen, setIsOpen] = useState<boolean>(subTreeActive);

  const baseStyles = cn(
    "flex items-center gap-3 text-sm h-11 rounded-lg transition-all duration-200 ease-in-out group relative",
    "hover:bg-sidebar-hover hover:translate-x-1",
    shouldHighlight
      ? "bg-gradient-to-r from-[#432ee5] to-[#e43e2b] text-white shadow-lg"
      : "text-sidebar-text hover:text-sidebar-text"
  );

  const linkBase = cn(
    "flex items-center gap-3 text-sm h-11 rounded-lg transition-all duration-200 ease-in-out group relative px-3",
    "hover:bg-sidebar-hover hover:translate-x-1",
    shouldHighlight
      ? "bg-gradient-to-r from-[#432ee5] to-[#e43e2b] text-white shadow-lg"
      : "text-sidebar-text hover:text-sidebar-text"
  );

  const groupBase = cn(
    "flex items-center gap-3 text-sm h-11 rounded-lg transition-all duration-200 ease-in-out group relative w-full justify-between px-3",
    "hover:bg-sidebar-hover hover:translate-x-1",
    // if group is open due to active child, show a subtle state, not the gradient
    isOpen && subTreeActive
      ? "ring-1 ring-sidebar-border/40 bg-sidebar-elev"
      : ""
  );

  const indentStyles = { paddingLeft: `${0.6 + depth * 0.2}rem` };

  if (hasSubItems) {
    const submenuId = `submenu-${item.name.replace(/\s+/g, "-").toLowerCase()}`;
    return (
      <li className="overflow-hidden">
        <button
          onClick={() => setIsOpen((o) => !o)}
          className={groupBase}
          style={indentStyles}
          aria-expanded={isOpen}
          aria-controls={submenuId}
          type="button"
        >
          <div className="flex items-center gap-3 min-w-0">
            {item.icon && (
              <span className="flex-shrink-0 transition-transform duration-200 group-hover:scale-110">
                {item.icon}
              </span>
            )}
            {!isCollapsed && (
              <span className="truncate font-medium">{item.name}</span>
            )}
          </div>
          {!isCollapsed && (
            <span className="flex-shrink-0 transition-transform duration-200">
              {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </span>
          )}
        </button>

        {!isCollapsed && isOpen && item.subItems && (
          <ul id={submenuId} className="mt-1 space-y-1">
            {item.subItems.map((subItem) => (
              <SidebarMenuItem
                key={subItem.path || subItem.name}
                item={subItem}
                isCollapsed={isCollapsed}
                depth={depth + 1}
                currentUserRole={currentUserRole}
              />
            ))}
          </ul>
        )}
      </li>
    );
  }

  if (item.path) {
    return (
      <li className="overflow-hidden">
        <Link
          to={item.path}
          className={linkBase}
          style={indentStyles}
          aria-current={shouldHighlight ? "page" : undefined}
        >
          {item.icon ? (
            <span className="flex-shrink-0 transition-transform duration-200 group-hover:scale-110">
              {item.icon}
            </span>
          ) : (
            <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-sidebar-text-muted group-hover:bg-sidebar-text" />
            </span>
          )}
          {!isCollapsed && (
            <span className="truncate font-medium">{item.name}</span>
          )}
        </Link>
      </li>
    );
  }

  return (
    <li className="overflow-hidden">
      <div
        className={cn(baseStyles, "px-3 cursor-default")}
        style={indentStyles}
      >
        {item.icon ? (
          <span className="flex-shrink-0">{item.icon}</span>
        ) : (
          <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-sidebar-text-muted" />
          </span>
        )}
        {!isCollapsed && (
          <span className="truncate font-medium text-sidebar-text-muted">
            {item.name}
          </span>
        )}
      </div>
    </li>
  );
};
