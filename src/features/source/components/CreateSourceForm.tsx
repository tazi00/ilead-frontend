// features/leads/components/CreateSourceForm.tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import {
  sourceService,
  type Source,
} from "@/features/leads/services/Source.service";
import Swal from "sweetalert2";
import { useModalStore } from "@/store/useModalStore";
import { Button } from "@/components/ui/button";

interface CreateSourceFormProps {
  sourceToEdit?: Source;
  refreshStatuses?: () => void;
}

function CreateSourceForm({
  sourceToEdit,
  refreshStatuses,
}: CreateSourceFormProps) {
  const [title, setTitle] = useState(sourceToEdit?.title || "");
  const [description, setDescription] = useState(
    sourceToEdit?.description || ""
  );
  const isEditing = !!sourceToEdit;
  const [submitting, setSubmitting] = useState(false);

  const { closeModal, setFormActions } = useModalStore();

  const canSubmit = title.trim() !== "";

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      if (sourceToEdit) {
        // Editing logic
        await sourceService.editSource(sourceToEdit._id, {
          title,
          description,
          data: sourceToEdit, // You may skip this if `data` isn't used server-side
        });
        Swal.fire("Success", "Source updated successfully", "success");
      } else {
        // Creation logic
        await sourceService.createSource({ title, description });
        Swal.fire("Success", "Source created successfully", "success");
      }

      refreshStatuses?.();
      closeModal();
    } catch (err) {
      console.error("Source form error:", err);
      Swal.fire("Error", "Operation failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    setFormActions?.({
      onSubmit: handleSubmit,
      onCancel: closeModal,
      canSubmit,
      isSubmitting: submitting,
    });
  }, [canSubmit, submitting]);

  return (
    <form className="space-y-4">
      <div>
        <Label htmlFor="title" className="mb-2">
          Title
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter source title"
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
          placeholder="Enter description"
        />
      </div>

      <div className="submit">
        <Button onClick={handleSubmit} disabled={submitting}>
          {submitting
            ? isEditing
              ? "Updating..."
              : "Creating..."
            : isEditing
              ? "Update"
              : "Create"}
        </Button>
      </div>
    </form>
  );
}

export default CreateSourceForm;
