import { useEffect, useState } from "react";
import { PropertyModule } from "@/features/leads/services/Property.service";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const STATUS_COLORS: Record<string, string> = {
  INFO: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  WARNING:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  ERROR: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  ACTION: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  SYSTEM: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
};

export default function WorkspaceLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [propertyName, setPropertyName] = useState<string>(""); // 🆕 Add state for name
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await new PropertyModule().getProperty();
        const logsData = response.data.data.logs || [];
        const name = response.data.data.name || "Workspace";

        // Sort logs by createdAt descending
        const sortedLogs = [...logsData].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setLogs(sortedLogs);
        setPropertyName(name);
      } catch (error) {
        console.error("Failed to fetch logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <Card className="shadow-md max-w-full mx-auto mt-8 bg-background text-foreground">
      <CardHeader>
        {loading ? (
          <Skeleton className="h-6 w-1/2 mb-2" />
        ) : (
          <CardTitle className="text-2xl font-semibold">
            {propertyName}'s logs
          </CardTitle>
        )}
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-2">
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div className="flex items-start space-x-4" key={i}>
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : logs.length === 0 ? (
            <p className="text-muted-foreground text-sm">No logs available.</p>
          ) : (
            logs.map((log, index) => (
              <div key={log._id || index} className="mb-6">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-medium text-base text-foreground">
                    {log.title}
                  </h4>
                  <Badge
                    className={cn(
                      "text-xs rounded-md px-2 py-1 font-semibold",
                      STATUS_COLORS[log.status] ||
                        "bg-muted text-muted-foreground"
                    )}
                  >
                    {log.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  {log.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(log.createdAt), "PPPpp")}
                </p>
                {index !== logs.length - 1 && <Separator className="mt-4" />}
              </div>
            ))
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
