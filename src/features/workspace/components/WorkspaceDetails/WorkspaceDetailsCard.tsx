import { useEffect, useState } from "react";
import { workspaceService } from "@/features/leads/services/Property.service";
import type { Property } from "@/features/leads/services/Property.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useModalStore } from "@/store/useModalStore";

import clsx from "clsx";
import { EditWorkspaceModal } from "../EditWorkspaceDetailsModals.tsx/EditWorkspaceModal";

function WorkspaceDetailsCard() {
  const [workspace, setWorkspace] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { openModal, setModalTitle } = useModalStore();

  useEffect(() => {
    const fetchWorkspace = async () => {
      try {
        const response = await workspaceService.getProperty();
        setWorkspace(response.data.data);
      } catch (err: any) {
        console.error("Failed to load workspace details:", err);
        setError("Failed to load workspace details.");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspace();
  }, []);

  if (loading)
    return (
      <div className="p-4 text-gray-700 dark:text-gray-200">
        Loading workspace details...
      </div>
    );
  if (error)
    return <div className="p-4 text-red-500 dark:text-red-400">{error}</div>;
  if (!workspace) return null;

  const getBooleanTag = (
    label: string,
    value: boolean,
    trueColor: string,
    falseColor: string
  ) => {
    const className = clsx(
      "text-xs font-semibold px-2.5 py-0.5 rounded-full inline-block w-fit",
      value ? trueColor : falseColor
    );
    return (
      <div className="flex items-center gap-2">
        <span className="text-gray-700 dark:text-gray-300">{label}:</span>
        <span className={className}>{value ? "Yes" : "No"}</span>
      </div>
    );
  };

  return (
    <Card className="max-w-2xl mx-auto mt-6 bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-200 relative">
      <button
        onClick={() => {
          setModalTitle?.("Edit Workspace Details!"); // <-- set the title
          openModal({
            content: <EditWorkspaceModal initialData={workspace} />,
            type: "form",
          });
        }}
        className="absolute top-4 right-4 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Edit
      </button>

      <CardHeader>
        <CardTitle className="text-xl font-bold">{workspace.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div>
          <strong className="text-gray-700 dark:text-gray-300">
            Description:
          </strong>
          <p className="mt-1 whitespace-pre-line">{workspace.description}</p>
        </div>
        <div>
          <strong className="text-gray-700 dark:text-gray-300">
            Usage Limits:
          </strong>{" "}
          {workspace.usage_count} / {workspace.usage_limits}
        </div>
        <div>
          Status:
          <span
            className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold
      ${
        workspace.status === "ACTIVE"
          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
          : workspace.status === "INACTIVE"
            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
            : workspace.status === "USAGE_LIMIT_EXCEEDED"
              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
      }
    `}
          >
            {workspace.status}
          </span>
        </div>
        <div>
          {getBooleanTag(
            "Workspace Verified",
            workspace.is_verified,
            "bg-green-100 text-green-800",
            "bg-gray-200 text-gray-700"
          )}
        </div>
        <div>
          {getBooleanTag(
            "Workspace Ban Status",
            workspace.is_banned,
            "bg-red-100 text-red-700",
            "bg-gray-200 text-gray-700"
          )}
        </div>
        <div>
          {getBooleanTag(
            "Workspace Reported",
            workspace.reported,
            "bg-yellow-100 text-yellow-800",
            "bg-gray-200 text-gray-700"
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default WorkspaceDetailsCard;
