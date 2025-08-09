import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useModalStore } from "@/store/useModalStore";
import { userService } from "@/features/leads/services/User.service";
import Swal from "sweetalert2";
import { useChatAgentStore } from "@/store/useChatAgentStore";

const availableRoles = ["Superadmin", "Admin", "Lead Manager", "Chat Agent"];

function CreateUserModal() {
  const closeModal = useModalStore((state) => state.closeModal);
  const setFormActions = useModalStore((state) => state.setFormActions);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const { fetchChatAgents } = useChatAgentStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    password: "",
    roleName: "",
    property_id: user?.property_id || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = Object.values(formData).every((val) => val.trim() !== "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setIsSubmitting(true);
    try {
      const res = await userService.createUser(formData);

      if (res.status === "SUCCESS" || res.status === "CREATED") {
        await fetchChatAgents();
        Swal.fire("Success", res.message, "success");
        closeModal();
      } else {
        Swal.fire("Error", res.message || "Failed to create user", "error");
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
  }, [canSubmit, isSubmitting, formData]);

  return (
    <div className="space-y-4 px-2 py-3">
      <div>
        <Label htmlFor="name" className="mb-2">
          Name
        </Label>
        <Input id="name" value={formData.name} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="email" className="mb-2">
          Email
        </Label>
        <Input id="email" value={formData.email} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="phone_number" className="mb-2">
          Phone Number
        </Label>
        <Input
          id="phone_number"
          value={formData.phone_number}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="password" className="mb-2">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="roleName" className="mb-2">
          Role Name
        </Label>
        <select
          id="roleName"
          value={formData.roleName}
          onChange={handleSelectChange}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select a role</option>
          {availableRoles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="property_id" className="mb-2">
          Property ID
        </Label>
        <Input
          id="property_id"
          value={formData.property_id}
          disabled
          className="bg-gray-100"
        />
      </div>
    </div>
  );
}

export default CreateUserModal;
