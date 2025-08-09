// components/modals/EditWorkspaceModal.tsx
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // if available
import { workspaceService } from "@/features/leads/services/Property.service";
import { useModalStore } from "@/store/useModalStore";
import Swal from "sweetalert2";

export function EditWorkspaceModal({ initialData }: { initialData: any }) {
  const [formData, setFormData] = useState({
    propId: initialData._id,
    name: initialData.name,
    description: initialData.description,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const closeModal = useModalStore((state) => state.closeModal);
  const setFormActions = useModalStore((state) => state.setFormActions);

  const canSubmit =
    formData.name.trim() !== "" && formData.description.trim() !== "";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    try {
      const res = await workspaceService.updateProperty(formData);
      if (res.data.status === "CREATED") {
        Swal.fire("Success", "Workspace updated successfully", "success");
        closeModal();
        window.location.reload();
      } else {
        Swal.fire("Error", res.data.message || "Failed to update", "error");
      }
    } catch (err: any) {
      Swal.fire("Error", err.message || "Something went wrong", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    setFormActions?.({
      onSubmit: handleSubmit,
      onCancel: closeModal,
      canSubmit,
      isSubmitting,
    });
  }, [formData, canSubmit, isSubmitting]);

  return (
    <div className="space-y-4 px-2 py-3">
      <div>
        <Label htmlFor="name" className="mb-2">
          Name
        </Label>
        <Input id="name" value={formData.name} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="description" className="mb-2">
          Description
        </Label>
        <Textarea
          id="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
