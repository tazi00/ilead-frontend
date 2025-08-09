import { memo } from "react";
import {
  EllipsisVertical,
  Phone,
  RefreshCw,
  Send,
  Tag,
  Trash,
  TrendingUp,
  User,
  UserPlus,
} from "lucide-react";
import type { Lead } from "@/features/leads/types";
import { useModalStore } from "@/store/useModalStore";
import {
  LeadAssign,
  LeadCreateCustomer,
  LeadDelete,
  LeadDetail,
  LeadLabels,
} from "../LeadModals";

import { LeadFollowUp, LeadStatus } from "../LeadModals/LeadModals";

interface LeadCardProps {
  lead: Lead;
}

const CARD_ACTIONS = [
  {
    icon: Trash,
    color: "red",
    label: "Delete Lead",
    title: "Delete Lead",
    el: <LeadDelete />,
    type: "form" as const,
    customActions: undefined,
  },
  {
    icon: Tag,
    color: "green",
    label: "Lead Label Assign",
    title: "Lead Label Assign",
    el: <LeadLabels />,
    type: "action" as const,
    customActions: undefined,
  },
  {
    icon: TrendingUp,
    color: "black",
    label: "Lead Assignment",
    title: "Change Lead Assign To",
    el: <LeadAssign />,
    type: "form",
    customActions: undefined,
  },
  {
    icon: UserPlus,
    color: "blue",
    label: "Convert Lead to Customer",
    title: null,
    el: <LeadCreateCustomer />,
    type: "info" as const,
    customActions: undefined,
  },
  {
    icon: RefreshCw,
    color: "blue",
    label: "Change Lead Status",
    title: "Change Lead Status",
    el: <LeadStatus />,
    type: "action" as const,
    customActions: undefined,
  },
  {
    icon: Send,
    color: "white",
    label: "Lead Follow Up",
    title: "Add Lead Follow Up",
    el: <LeadFollowUp />,
    type: "form" as const,
    customActions: undefined,
  },
] as const;

export const LeadCard = memo(({ lead }: LeadCardProps) => {
  const assignedToName = lead.assigned_to.name;
  const leadName = String(lead.name);
  const phoneNumber = String(lead.phone_number);
  const createdAt = String(lead.createdAt);
  const assignedBy = String(lead?.assigned_by?.name || "Test User");
  const { openModal, setModalTitle, setData, setModalSize } = useModalStore();

  return (
    <div className="bg-white dark:bg-primary rounded-lg shadow hover:shadow-lg transition-all">
      <div
        className="cursor-pointer"
        onClick={() => {
          setModalTitle?.("Lead Details");
          setData?.({ _id: lead._id, rayId: lead?.meta?.ray_id });

          setModalSize?.("lg");
          openModal({
            content: <LeadDetail />,
            type: "action" as const,
          });
        }}
      >
        <div className="pt-5 px-6">
          <div className="flex flex-wrap gap-2 mb-3">
            {lead.labels?.length > 0 ? (
              lead.labels.map((label) => (
                <span
                  key={label._id || label.title}
                  className="bg-red-600 text-white text-xs px-3 py-1 rounded"
                >
                  {label.title}
                </span>
              ))
            ) : (
              <span className="bg-gray-600 text-white text-xs px-3 py-1 rounded">
                No Label
              </span>
            )}
          </div>

          <div className="text-gray-800 dark:text-white text-xs font-medium flex items-center gap-2 mb-2">
            <User color="blue" size={18} />
            <span>{leadName}</span>
          </div>

          <div className="text-gray-800 dark:text-white text-xs font-medium flex items-center gap-2 mb-4">
            <Phone color="green" size={18} />
            <span>{phoneNumber}</span>
          </div>
        </div>

        <div className="space-y-1 px-6">
          <div className="text-gray-800 dark:text-white text-xs flex items-center gap-1">
            <span className="font-medium">CD:</span>
            <span>{new Date(createdAt).toLocaleString()}</span>
          </div>
          <div className="text-gray-800 dark:text-white text-xs flex items-center gap-1">
            <span className="font-medium">BY:</span>
            <span>{assignedBy}</span>
          </div>
          <div className="text-gray-800 dark:text-white text-xs flex items-center gap-1">
            <span className="font-medium">TO:</span>
            <span>{assignedToName}</span>
          </div>
        </div>
      </div>

      <div className="mt-3 items-center py-3 px-2 border-t border-gray-300 dark:border-gray-600 flex gap-1.5">
        {CARD_ACTIONS.map(
          ({ icon: Icon, color, label, el, type, customActions, title }) => (
            <button
              key={label}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors cursor-pointer"
              title={label}
              onClick={() => {
                setModalTitle?.(title);
                setModalSize?.("sm");
                setData?.({
                  _id: lead._id,
                  rayId: lead.meta?.ray_id,
                });
                openModal({
                  content: el,
                  type,
                  customActions,
                });
              }}
            >
              <div className="relative">
                <Icon size={16} color={color} />
                {label === "Lead Follow Up" && (
                  <span className="absolute -top-1 -right-1 bg-gray-300 dark:bg-gray-800 text-black dark:text-white text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center">
                    {lead.follow_ups?.length ?? 0}
                  </span>
                )}
              </div>
            </button>
          )
        )}
        <button className="ms-auto p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors">
          <EllipsisVertical size={16} />
        </button>
      </div>
    </div>
  );
});

LeadCard.displayName = "LeadCard";
