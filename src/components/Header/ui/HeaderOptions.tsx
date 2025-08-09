import ThemeToggler from "@/components/ThemeToggler";
import { Link } from "@tanstack/react-router";
import { Bell, Copy, ListTodo, Moon, PhoneMissed, Search } from "lucide-react";

const icons = [PhoneMissed, ListTodo, Copy, Search, Moon, Bell];

export default function HeaderOptionsBox({
  logCount = 0,
}: {
  logCount?: number;
}) {
  return (
    <ul className="flex gap-3 items-center">
      {icons.map((Icon, idx) => {
        const isMoon = Icon === Moon;
        const isBell = Icon === Bell;

        if (isMoon) {
          return (
            <li key={idx}>
              <ThemeToggler />
            </li>
          );
        }

        return (
          <li key={idx} className="relative">
            <Link to=".">
              <Icon size={22} />
              {isBell && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {logCount > 99 ? "99+" : logCount}
                </span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
