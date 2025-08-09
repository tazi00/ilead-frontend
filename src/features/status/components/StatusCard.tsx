import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useModalStore } from "@/store/useModalStore";
import { Pencil, Trash } from "lucide-react";

import CreateStatusForm from "./CreateStatusForm";

import { statusService } from "@/features/leads/services/Status.service";
import type { Status } from "@/features/leads/services/Status.service";
import Swal from "sweetalert2";

function StatusCard() {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [totalStatuses, setTotalStatuses] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await statusService.getPaginatedStatuses(page, limit);
      setStatuses(res.data.data.statuses);
      const total = res.data.data.pagination.total || 0;
      setTotalPages(Math.ceil(total / limit));
      setTotalStatuses(total);
    } catch (err) {
      console.error("Error fetching statuses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const openModal = useModalStore((state) => state.openModal);

  const handleOpenCreateModal = () => {
    openModal({
      content: (
        <>
          <h2 className="text-lg font-semibold mb-4">Create New Status</h2>
          <CreateStatusForm refreshStatuses={fetchData} />
        </>
      ),
      type: "form",
      customActions: <></>,
    });
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will deactivate the status (soft delete).",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await statusService.deleteStatus({ id });
        await fetchData();
        Swal.fire("Deleted!", "The status has been deactivated.", "success");
      } catch (error) {
        console.error("Delete failed:", error);
        Swal.fire("Error!", "Failed to delete the status.", "error");
      }
    }
  };

  const handleEdit = (status: Status) => {
    openModal({
      content: (
        <>
          <h2 className="text-lg font-semibold mb-4">Edit Status</h2>
          <CreateStatusForm refreshStatuses={fetchData} statusToEdit={status} />
        </>
      ),
      type: "form",
      customActions: <></>,
    });
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold dark:text-white">Status List</h2>
        <Button onClick={handleOpenCreateModal}>Add New Status</Button>
      </div>

      <div className="rounded-md border dark:border-gray-700">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="dark:text-gray-200">Title</TableHead>
              <TableHead className="dark:text-gray-200">Description</TableHead>
              <TableHead className="dark:text-gray-200">Status</TableHead>
              <TableHead className="dark:text-gray-200">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center py-4 dark:text-gray-300"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : statuses.length > 0 ? (
              statuses.map((status) => (
                <TableRow key={status._id}>
                  <TableCell className="dark:text-gray-100">
                    {status.title}
                  </TableCell>
                  <TableCell className="dark:text-gray-100">
                    {status.description}
                  </TableCell>
                  <TableCell className="dark:text-gray-100">
                    <Badge
                      variant={status.meta.is_active ? "default" : "secondary"}
                      className={
                        status.meta.is_active
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-gray-500 hover:bg-gray-600 text-white"
                      }
                    >
                      {status.meta.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex gap-2 items-center">
                    <Pencil
                      size={18}
                      className="cursor-pointer text-blue-600 hover:text-blue-800"
                      onClick={() => handleEdit(status)}
                    />

                    <Trash
                      size={18}
                      className="cursor-pointer text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(status._id)}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center py-4 dark:text-gray-400"
                >
                  No statuses found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground dark:text-gray-300">
          Showing {statuses.length} of {totalStatuses} total statuses
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Prev
          </Button>
          <span className="text-sm dark:text-white">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export default StatusCard;
