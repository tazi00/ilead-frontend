import { useEffect, useState } from "react";
import Chart from "react-apexcharts";

import Select from "react-select";
import { Input } from "@/components/ui/input";

import { chatAgentService } from "@/features/leads/services/ChatAgents.service";
import { sourceStatsService } from "@/features/leads/services/LeadsModule.service";

interface Props {
  showMenu: boolean;
  startDate: string;
  endDate: string;
  selectedAgent: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onAgentChange: (value: string) => void;
}
const LeadSourceChart: React.FC<Props> = ({
  showMenu,
  startDate,
  endDate,
  selectedAgent,
  onStartDateChange,
  onEndDateChange,
  onAgentChange,
}) => {
  const [labels, setLabels] = useState<string[]>([]);
  const [series, setSeries] = useState<number[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [hasFetched, setHasFetched] = useState<boolean>(false);
  const fetchChartData = async () => {
    if (!selectedAgent) return;

    try {
      const res = await sourceStatsService.getLeadsAccordingToSource({
        startDate,
        endDate,
        agentId: selectedAgent,
      });
      const response = res.data.data;
      setLabels(
        Array.isArray(response.sources)
          ? response.sources.map((status: any) => status.name ?? String(status))
          : []
      );
      setSeries(Array.isArray(response.data) ? response.data : []);
      setHasFetched(true);
    } catch (err) {
      console.error("Failed to fetch chart data:", err);
      setHasFetched(true);
    }
  };

  const fetchAgents = async () => {
    try {
      const res = await chatAgentService.chatAgents();
      setAgents(res.data.data);
    } catch (err) {
      console.error("Failed to fetch agents:", err);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  return (
    <>
      {showMenu && (
        <div className="flex flex-col gap-4 mt-4 mb-6 p-4 border rounded-lg bg-gray-50 max-w-md mx-auto">
          <label className="text-sm font-medium text-gray-700">
            Start Date
          </label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
          />

          <label className="text-sm font-medium text-gray-700">End Date</label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
          />

          <label className="text-sm font-medium text-gray-700">
            Select Agent
          </label>
          <Select
            options={agents.map((agent) => ({
              value: agent._id,
              label: agent.name,
            }))}
            onChange={(option) => onAgentChange(option?.value || "")}
            placeholder="Select Agent"
          />

          <button
            onClick={fetchChartData}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </div>
      )}

      {hasFetched && series.length === 0 ? (
        <p className="text-center text-gray-500 mt-4">No leads found</p>
      ) : (
        series.length > 0 && (
          <Chart
            options={{
              chart: {
                type: "donut",
              },
              labels,
              legend: {
                position: "bottom",
              },
              tooltip: {
                y: {
                  formatter: (val: number, {}: any) => {
                    return `${val} leads`;
                  },
                },
              },
              plotOptions: {
                pie: {
                  donut: {
                    labels: {
                      show: true,
                      total: {
                        show: true,
                        label: "Leads Source",
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#ffffff",
                        formatter: () => {
                          const total = series.reduce(
                            (sum, val) => sum + val,
                            0
                          );
                          return `${total}`;
                        },
                      },
                    },
                  },
                },
              },
              dataLabels: {
                formatter: function (val: number) {
                  return `${Math.round(val)}%`;
                },
              },
            }}
            series={series}
            type="donut"
            width="100%"
          />
        )
      )}
    </>
  );
};

export default LeadSourceChart;
