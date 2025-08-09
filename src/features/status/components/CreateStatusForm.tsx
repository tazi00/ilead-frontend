import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { statusService } from "@/features/leads/services/Status.service";
import type { Status } from "@/features/leads/services/Status.service";
import Swal from "sweetalert2";
import { useModalStore } from "@/store/useModalStore";
import { Switch } from "@/components/ui/switch";

type Props = {
  refreshStatuses: () => void;
  statusToEdit?: Status;
};
export default function CreateStatusForm({
  refreshStatuses,
  statusToEdit,
}: Props) {
  const closeModal = useModalStore((state) => state.closeModal);
  const [title, setTitle] = useState(statusToEdit?.title || "");
  const [description, setDescription] = useState(
    statusToEdit?.description || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isActive, setIsActive] = useState(
    statusToEdit?.meta?.is_active ?? true
  );

  const isEditing = !!statusToEdit;

  const handleSubmit = async () => {
    if (!title.trim()) {
      Swal.fire("Error", "Title is required", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing) {
        // Edit logic
        const payload = {
          statusId: statusToEdit._id,
          title,
          description,
          meta: { is_active: isActive },
        };
        const res = await statusService.editStatus(payload);
        if (res.status === "SUCCESS") {
          Swal.fire("Updated", res.message, "success");
        } else {
          Swal.fire("Error", res.message, "error");
        }
      } else {
        // Create logic
        const payload = { title, description };
        const res = await statusService.createStatus(payload);
        if (res.status === "CREATED") {
          Swal.fire("Success", res.message, "success");
        } else {
          Swal.fire("Error", res.message, "error");
        }
      }

      refreshStatuses();
      closeModal();
    } catch (err: any) {
      Swal.fire("Error", err.message || "Something went wrong", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 p-2">
      <div>
        <Label htmlFor="title" className="mb-2">
          Status Title
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., In Progress"
          required
        />
      </div>

      <div>
        <Label htmlFor="description" className="mb-2">
          Description
        </Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional description"
        />
      </div>
      {isEditing && (
        <div className="flex items-center space-x-4">
          <Label htmlFor="active-toggle" className="text-sm font-medium">
            Active
          </Label>
          <Switch
            id="active-toggle"
            checked={isActive}
            onCheckedChange={setIsActive}
          />
          <span className="text-sm text-muted-foreground">
            {isActive ? "Status is active" : "Status is inactive"}
          </span>
        </div>
      )}

      <div className="submit">
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting
            ? isEditing
              ? "Updating..."
              : "Creating..."
            : isEditing
              ? "Update"
              : "Create"}
        </Button>
      </div>
    </div>
  );
}
