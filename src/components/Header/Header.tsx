import { useSidebarStore } from "@/store/useSidebarStore";
import HeaderBtnLists from "./ui/HeaderBtnLists";
import HeaderOptionsBox from "./ui/HeaderOptions";
import UserProfileBox from "./ui/UserProfile";

import { PropertyModule } from "@/features/leads/services/Property.service";
import { useEffect, useState } from "react";

function Header() {
  const { setMobileOpen } = useSidebarStore();
  const [logCount, setLogCount] = useState<number>(0);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await new PropertyModule().getProperty();
        setLogCount(res?.data?.data.logs?.length || 0);
      } catch (error) {
        console.error("Failed to fetch property logs:", error);
      }
    };

    fetchLogs();
  }, []);
  return (
    <header className="bg-primary p-3 flex items-center justify-between shadow-lead rounded-sm sticky top-0 z-10">
      <HeaderBtnLists />
      <div className="ms-auto flex gap-2">
        <HeaderOptionsBox logCount={logCount} />
        <UserProfileBox />
        <button
          className="lg:hidden"
          onClick={() => {
            setMobileOpen(true);
          }}
        >
          menu
        </button>
      </div>
    </header>
  );
}

export default Header;
