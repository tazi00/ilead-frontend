import { useSidebarStore } from "@/store/useSidebarStore";
import HeaderBtnLists from "./ui/HeaderBtnLists";
import HeaderOptionsBox from "./ui/HeaderOptions";
import UserProfileBox from "./ui/UserProfile";

function Header() {
  const { setMobileOpen } = useSidebarStore();

  return (
    <header className="bg-primary p-3 flex items-center justify-between shadow-lead rounded-sm sticky top-0 z-10">
      <HeaderBtnLists />
      <div className="ms-auto flex gap-2">
        <HeaderOptionsBox />
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
