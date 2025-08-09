import { useEffect, useState } from "react";
import {
  chatAgentService,
  type Pagination,
  type Agent,
} from "@/features/leads/services/ChatAgents.service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import { useModalStore } from "@/store/useModalStore";

import CreateUserModal from "./CreateUserModal";

function ChatAgentTable() {
  const [chatAgents, setChatAgents] = useState<Agent[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [totalStatuses, setTotalStatuses] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const res = await chatAgentService.fetchPaginatedChatAgents(page, limit);
      const total = res.data.data.pagination.total || 0;
      setTotalPages(Math.ceil(total / limit));
      setChatAgents(res.data.data.chatAgents);
      setPagination(res.data.data.pagination);
      setTotalStatuses(total);
    } catch (err) {
      console.error("Failed to fetch chat agents", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, [page]);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Chat Agents</h2>
        <Button
          onClick={() => {
            const { openModal, setModalTitle, setModalSize } =
              useModalStore.getState();
            openModal({
              content: <CreateUserModal />,
              type: "form",
            });
            setModalTitle?.("Create User");
            setModalSize?.("md");
          }}
        >
          Create User
        </Button>
      </div>

      <div className="rounded-md border dark:border-gray-700">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-4 dark:text-gray-300"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : chatAgents.length > 0 ? (
              chatAgents.map((agent) => (
                <TableRow key={agent._id}>
                  <TableCell>{agent.name}</TableCell>
                  <TableCell>{agent.email}</TableCell>
                  <TableCell>{agent.phone_number}</TableCell>
                  <TableCell>
                    {new Date(agent.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-4 dark:text-gray-400"
                >
                  No chat agents made yet! Create one!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Row */}
      {pagination && (
        <div className="flex justify-between items-center mt-4 px-1">
          <div className="text-sm text-muted-foreground dark:text-gray-300">
            Showing {chatAgents.length} of {totalStatuses} total statuses
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
      )}
    </div>
  );
}

export default ChatAgentTable;
