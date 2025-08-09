import { Button } from "@/components/ui/button";
import HeaderActionButton from "./HeaderBtn";
import { Ellipsis, Funnel, Plus } from "lucide-react";
import { useModalStore } from "@/store/useModalStore";
import CreateLeadModal from "@/features/leads/components/HeaderBtnModals/CreateLeadModal";

const headerButtons = [
  {
    label: "Lead",
    icon: Plus,
    afterIcon: Funnel,
    modalEl: <CreateLeadModal />,
  },
  // { label: "Task", icon: Plus, afterIcon: Calendar, modalEl: <h2>Task</h2> },
  // {
  //   label: "Note",
  //   icon: Plus,
  //   afterIcon: SquareCheckBig,
  //   modalEl: <h2>Note</h2>,
  // },
  // { label: "Remider", icon: Plus, afterIcon: Bell, modalEl: <h2>Reminder</h2> },
  // {
  //   label: "Meeting",
  //   icon: Plus,
  //   afterIcon: Presentation,
  //   modalEl: <h2>Meeting</h2>,
  // },
];

function HeaderBtnLists() {
  // const { mobileOpen } = useSidebarStore();
  const { openModal } = useModalStore();
  return (
    <ul className="flex gap-2 items-center">
      {headerButtons.map((btn, index) => (
        <li
          key={index}
          onClick={() =>
            openModal({
              type: "info",
              content: btn.modalEl,
            })
          }
        >
          <HeaderActionButton
            icon={btn.icon}
            label={btn.label}
            afterIcon={btn.afterIcon}
          />
        </li>
      ))}

      <li>
        <Button size="icon" className="rounded-full h-8 w-8">
          <Ellipsis />
        </Button>
      </li>
    </ul>
  );
}

export default HeaderBtnLists;
