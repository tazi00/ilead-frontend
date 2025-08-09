import LeadCard from "@/features/dashboard/components/LeadCard";
import LeadTab from "@/features/dashboard/components/LeadTab";
import type { LeadTabType } from "@/features/dashboard/components/LeadTab/LeadTab";
// import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

import { createFileRoute } from "@tanstack/react-router";
// import { Plus } from "lucide-react";
import type { Lead } from "@/features/leads/types";
import { dashboardLeads } from "@/features/leads/services/HomePage.service";
import LeadStatusChart from "@/features/dashboard/components/LeadStatusChart/LeadStatusChart";
import { Menu } from "lucide-react";
import LeadSourceChart from "@/features/dashboard/components/LeadSourceChart/LeadSourceChart";

export const Route = createFileRoute("/_dashboardLayout/dashboard/")({
  component: RouteComponent,
});

type DashboardCardType = {
  title: string;
  tabData: LeadTabType;
};

function RouteComponent() {
  // const currentLeads;
  const [leadData, setLeadData] = useState<{
    leads_in_new: Lead[];
    leads_in_processing: Lead[];
  } | null>(null);

  const [showMenu, setShowMenu] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("");

  const [showSourceMenu, setShowSourceMenu] = useState(false);
  const [sourceStartDate, sourceSetStartDate] = useState("");
  const [sourceEndDate, sourceSetEndDate] = useState("");
  const [sourceSelectedAgent, sourceSetSelectedAgent] = useState("");

  useEffect(() => {
    dashboardLeads
      .getTodayLeads()
      .then((res) =>
        setLeadData({
          leads_in_new: res.data.data.leads_in_new.map((lead: any) => ({
            ...lead,
            title: lead.title ?? "",
            assigned_to: lead.assigned_to ?? "",
            status: lead.status ?? "",
            assigned_by: lead.assigned_by ?? "",
            labels: lead.labels ?? [],
          })),
          leads_in_processing: res.data.data.leads_in_processing.map(
            (lead: any) => ({
              ...lead,
              title: lead.title ?? "",
              assigned_to: lead.assigned_to ?? "",
              status: lead.status ?? "",
              assigned_by: lead.assigned_by ?? "",
              labels: lead.labels ?? [],
            })
          ),
        })
      )
      .catch((err) => console.error("Lead API Error:", err));
  }, []);

  if (!leadData) return <div>Loading...</div>;

  const cardsData: DashboardCardType[] = [
    {
      title: "Today's Lead",
      tabData: {
        content: [
          {
            label: `New (${leadData.leads_in_new.length})`,
            description: "Leads that are new.",
            leads: leadData.leads_in_new,
          },
          {
            label: `Processing (${leadData.leads_in_processing.length})`,
            description: "Leads currently in process.",
            leads: leadData.leads_in_processing,
          },
          {
            label: "Close-By",
            description: "Leads that are close to conversion.",
            leads: [], // You can add later if API supports it
          },
        ],
      },
    },
    // You can populate tasks and reminders similarly later
    {
      title: "Today's Task",
      tabData: {
        content: [
          { label: "Today", description: "Tasks not yet started." },
          { label: "Tommorow", description: "Tasks currently happening." },
        ],
      },
    },
    {
      title: "Today's Reminders",
      tabData: {
        content: [
          { label: "Reminders", description: "Today's reminders." },
          { label: "Meetings", description: "Reminders coming soon." },
          { label: "Events", description: "You missed these." },
        ],
      },
    },
  ];

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const allowedRoles = ["Admin", "Superadmin"];
  const hasAccess = allowedRoles.includes(user?.role);

  return (
    <section className="dashboard-sec">
      <div className="stats  ">
        <div className="grid grid-cols-3 gap-7">
          {cardsData.map((card, idx) => (
            <LeadCard key={idx} title={card.title}>
              <LeadTab data={card.tabData} />
            </LeadCard>
          ))}
        </div>
      </div>
      {/* <div className="sticky-notes mt-5">
        <h3 className="text-lg font-medium pb-0 ">Sticky Notes</h3>
        <Card className="mt-2">
          <CardContent className="text-center space-y-3 py-3">
            <Button>
              {" "}
              <Plus /> Add Notes
            </Button>
            <p className="text-sm">There are No Records to display</p>
          </CardContent>
        </Card>
      </div> */}

      {hasAccess && (
        <div className="status mt-5">
          <div className="grid grid-cols-2 gap-7">
            <div className="col">
              <Card>
                <div className="flex justify-between items-center px-6">
                  <CardTitle>Lead Status</CardTitle>
                  <button
                    className="p-2 rounded-md hover:bg-primary transition"
                    onClick={() => setShowMenu((prev) => !prev)}
                  >
                    <Menu className="w-6 h-6" />
                  </button>
                </div>
                <CardContent>
                  <LeadStatusChart
                    showMenu={showMenu}
                    startDate={startDate}
                    endDate={endDate}
                    selectedAgent={selectedAgent}
                    onStartDateChange={setStartDate}
                    onEndDateChange={setEndDate}
                    onAgentChange={setSelectedAgent}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="col">
              <Card>
                <div className="flex justify-between items-center px-6">
                  <CardTitle>Lead Source</CardTitle>
                  <button
                    className="p-2 rounded-md hover:bg-gray-100 transition"
                    onClick={() => setShowSourceMenu((prev) => !prev)}
                  >
                    <Menu className="w-6 h-6" />
                  </button>
                </div>
                <CardContent>
                  <LeadSourceChart
                    showMenu={showSourceMenu}
                    startDate={sourceStartDate}
                    endDate={sourceEndDate}
                    selectedAgent={sourceSelectedAgent}
                    onStartDateChange={sourceSetStartDate}
                    onEndDateChange={sourceSetEndDate}
                    onAgentChange={sourceSetSelectedAgent}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
