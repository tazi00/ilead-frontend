import {
  Funnel,
  House,
  Tags,
  FileText,
  MessageSquare,
  Activity,
  UserCircle,
  Users,
} from "lucide-react";

// Get user role safely from localStorage
const user = JSON.parse(localStorage.getItem("user") || "{}");
const currentUserRole = user?.role || "";

// All navigation items
const navItems = [
  { name: "Dashboard", icon: <House size={20} />, path: "/dashboard" },
  { name: "Lead", icon: <Funnel size={20} />, path: "/lead" },
  {
    name: "Label",
    icon: <Tags size={20} />,
    path: "/label",
    roles: ["Admin", "Superadmin"],
  },

  {
    name: "Status",
    icon: <Activity size={20} />,
    path: "/status",
    roles: ["Admin", "Superadmin"],
  },

  {
    name: "Source",
    icon: <Activity size={20} />,
    path: "/source",
    roles: ["Admin", "Superadmin"],
  },
  {
    name: "Workspace Logs",
    icon: <MessageSquare size={20} />,
    path: "/workspace-logs",
    roles: ["Admin", "Superadmin"],
  },
  {
    name: "User Module",
    icon: <Users size={20} />,
    path: "/users",
    roles: ["Admin", "Superadmin"],
  },
  {
    name: "Customers",
    icon: <UserCircle size={20} />,
    path: "/customer",
    roles: ["Admin", "Superadmin"],
  },

  {
    name: "Third Party Integrations",
    icon: <UserCircle size={20} />,
    path: "/third-party-integration",
    roles: ["Admin", "Superadmin"],
  },
  { name: "Reports", icon: <FileText size={20} />, path: "/reports" },
];

// Filter items based on role
export const filteredNavItems = navItems.filter((item) => {
  if (!item.roles) return true; // Show to all if no roles specified
  return item.roles.includes(currentUserRole); // Only show if role allowed
});
