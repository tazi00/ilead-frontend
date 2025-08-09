import type { Lead } from "@/features/leads/types";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../components/ui/tabs";

import { User, Mail, MapPin } from "lucide-react";

export type LeadTabType = {
  content: {
    label: string;
    description: string;
    leads?: Lead[];
  }[];
};
function LeadTab({ data }: { data: LeadTabType }) {
  const firstValue = data.content[0]?.label || "tab0";

  return (
    <Tabs defaultValue={firstValue}>
      <TabsList className="flex space-x-2 p-2">
        {data.content.map((item, index) => (
          <TabsTrigger key={index} value={item.label}>
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {data.content.map((item, index) => (
        <TabsContent key={index} value={item.label} className="px-4 py-2">
          {item.leads && item.leads.length > 0 ? (
            <ul className="space-y-3 max-h-[300px] overflow-y-auto">
              {item.leads.map((lead) => (
                <li
                  key={lead._id}
                  className="border border-gray-200 dark:border-gray-700 rounded-md p-3 shadow-sm"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 font-medium text-base">
                      <User className="w-4 h-4 text-gray-500" />
                      {lead.name}
                    </div>
                    <div className="text-gray-600 flex items-center text-base">
                      📞{" "}
                      <p className="ml-1 font-medium text-base">
                        {lead.phone_number}
                      </p>
                    </div>
                  </div>

                  <div className="text-sm flex items-center gap-1">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-base">{lead.email}</span>
                  </div>

                  <div className="text-sm flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-base">{lead?.address}</span>
                  </div>
                  <div className="text-base mt-1">Comments: {lead.comment}</div>
                  <div className="text-sm text-gray-400 mt-1">
                    Ref: {lead.reference}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400">No leads in this tab.</p>
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
}

export default LeadTab;
