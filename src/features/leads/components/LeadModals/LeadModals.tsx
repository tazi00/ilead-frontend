import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useModalStore } from "@/store/useModalStore";
import { useForm, type AnyFieldApi } from "@tanstack/react-form";
import { useEffect, useState } from "react";
import { useDeleteLead } from "../../hooks/useDeleteLeads";

// import { useMutation } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useChatAgents } from "../../hooks/useChatAgents";
import { Input } from "@/components/ui/input";
import {
  EllipsisVertical,
  Info,
  RefreshCcw,
  Send,
  SquarePen,
  Tag,
  Trash,
  TrendingUp,
  UserPlus,
  CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LeadsModule } from "../../services/LeadsModule.service";
import { LabelService } from "../../services/Lable.service";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { CustomerModule } from "../../services/Customer.service";
import type { AxiosResponse } from "axios";
import { StatusService } from "../../services/Status.service";

import { FileUploader } from "@/components/MediaUploader/FileUploader";
import { AudioRecorderUploader } from "@/components/MediaUploader/AudioRecorderUploader";

import "react-datepicker/dist/react-datepicker.css";

const leadsApi = new LeadsModule();
const labelApi = new LabelService();

const statusApi = new StatusService();

const MySwal = withReactContent(Swal);
const customerModule = new CustomerModule();
export interface LabelItem {
  _id: string;
  title: string;
}

export interface StatusItem {
  _id: string;
  title: string;
}

export interface LabelResponse {
  data: LabelItem[]; // This must be an array
}

export interface StatusResponse {
  data: StatusItem[]; // This must be an array
}

function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em className="text-red-500 text-sm">
          {field.state.meta.errors.join(",")}
        </em>
      ) : null}
      {field.state.meta.isValidating ? (
        <span className="text-blue-500 text-sm">Validating...</span>
      ) : null}
    </>
  );
}

export function LeadDelete() {
  const { setFormActions, data, closeModal } = useModalStore();
  const { deleteLead, isDeleting, isSuccess, error } = useDeleteLead();
  const rayId = data?.rayId;
  const form = useForm({
    defaultValues: {
      reason: "",
    },
    onSubmit: async ({ value }) => {
      deleteLead({
        rayId,
        deleteReason: value.reason,
      });
      console.log("Deleting lead with reason:", {
        reason: value.reason,
        rayId: data,
      });
    },
  });

  // Close modal when deletion is successful
  useEffect(() => {
    if (isSuccess) {
      closeModal();
    }
  }, [isSuccess, closeModal]);

  // Expose form actions to modal
  useEffect(() => {
    setFormActions?.({
      onSubmit: () => form.handleSubmit(),
      onCancel: () => form.reset(),
      canSubmit: form.state.canSubmit && !isDeleting, // Disable when deleting
      isSubmitting: isDeleting, // Use mutation loading state
    });

    const unsubscribe = form.store.subscribe(() => {
      setFormActions?.({
        onSubmit: () => form.handleSubmit(),
        onCancel: () => form.reset(),
        canSubmit: form.state.canSubmit && !isDeleting,
        isSubmitting: isDeleting,
      });
    });

    return unsubscribe;
  }, [form, setFormActions, isDeleting]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div className="space-y-4">
        <form.Field
          name="reason"
          validators={{
            onChange: ({ value }) =>
              !value ? "Please provide a reason for deletion" : undefined,
          }}
        >
          {(field) => (
            <div className="flex flex-col gap-2">
              <Label htmlFor={field.name}>Delete Reason:</Label>
              <Textarea
                placeholder="Enter Delete Reason"
                className="w-full bg-white"
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                disabled={isDeleting}
              />
              <FieldInfo field={field} />
            </div>
          )}
        </form.Field>

        {/* Show error if deletion fails */}
        {error && (
          <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md border border-red-200">
            <strong>Error:</strong>{" "}
            {error.message || "Failed to delete lead. Please try again."}
          </div>
        )}

        {/* Show loading state */}
        {isDeleting && (
          <div className="text-blue-500 text-sm bg-blue-50 p-3 rounded-md border border-blue-200">
            <strong>Deleting lead...</strong> Please wait while we process your
            request.
          </div>
        )}

        <div className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-md border border-yellow-200">
          <strong>Warning:</strong> This action cannot be undone. The lead will
          be permanently deleted.
        </div>
      </div>
    </form>
  );
}

export function LeadLabels() {
  const { data, closeModal } = useModalStore();
  const leadId = data?._id;
  const [search, setSearch] = useState("");

  const [labels, setLabels] = useState<LabelItem[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLabels() {
      try {
        const res = (await labelApi.labels()) as AxiosResponse<LabelResponse>;
        const cleanedLabels = res.data.data.map((label) => ({
          _id: label._id,
          title: label.title,
        }));
        setLabels(cleanedLabels);
      } catch (err) {
        setError("Failed to load labels");
      }
    }

    fetchLabels();
  }, []);

  const toggleLabel = (id: string) => {
    setSelected((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const assignLabels = async () => {
    if (!leadId || selected.size === 0) return;

    setIsSubmitting(true);
    setError(null);
    try {
      await leadsApi.assignLabelToLead({
        leadId,
        labelIds: Array.from(selected),
      });
      closeModal(); // close on success
    } catch (err) {
      setError("Failed to assign labels. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search labels..."
        disabled={isSubmitting}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full"
      />
      <ul className="min-h-[200px] max-h-[150px] overflow-y-auto mt-3 space-y-2">
        {labels
          .filter((label) =>
            label.title.toLowerCase().includes(search.toLowerCase())
          )
          .map((label) => (
            <li key={label._id} className="flex items-center gap-2">
              <input
                type="checkbox"
                id={label._id}
                checked={selected.has(label._id)}
                onChange={() => toggleLabel(label._id)}
                disabled={isSubmitting}
              />
              <label htmlFor={label._id} className="text-sm">
                {label.title}
              </label>
            </li>
          ))}
      </ul>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <Button
        className="bg-green-600 hover:bg-green-700 w-full"
        disabled={isSubmitting || selected.size === 0}
        onClick={assignLabels}
      >
        {isSubmitting ? "Assigning..." : "Assign Labels"}
      </Button>
    </div>
  );
}

export function LeadAssign() {
  const { agents } = useChatAgents();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const { data, closeModal, setFormActions, setSubmitLabel } = useModalStore();

  const handleAssign = async () => {
    if (!selectedAgentId) {
      Swal.fire("Error", "Please select an agent.", "error");
      return;
    }

    try {
      const payload = {
        leadId: data._id,
        chatAgentId: selectedAgentId,
      };

      await leadsApi.assignLeadTo(payload);

      Swal.fire("Success", "Lead assigned successfully.", "success");
      closeModal?.();
    } catch (error: any) {
      Swal.fire("Error", error?.message || "Something went wrong", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Setup modal form actions
  useEffect(() => {
    setSubmitLabel?.("Assign");
    setFormActions?.({
      onSubmit: handleAssign,
      onCancel: () => closeModal?.(),
      canSubmit: !!selectedAgentId,
      isSubmitting,
    });
  }, [selectedAgentId, isSubmitting]);

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="user">User:</Label>
        <Select onValueChange={(value) => setSelectedAgentId(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose Agent to assign" />
          </SelectTrigger>
          <SelectContent>
            {agents.data.map((agent) => (
              <SelectItem key={agent._id} value={agent._id}>
                {agent.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export function LeadCreateCustomer() {
  const { closeModal, data } = useModalStore();
  const [loading, setLoading] = useState(false);

  const handleConvert = async () => {
    if (!data?._id) {
      await MySwal.fire({
        icon: "error",
        title: "Missing Lead ID",
        text: "Unable to convert. Lead ID is required.",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await customerModule.convertToCustomer({ leadId: data._id });

      await MySwal.fire({
        icon: "success",
        title: "Conversion Successful",
        text: res.message,
        timer: 2000,
        showConfirmButton: false,
      });

      closeModal();
    } catch (error) {
      console.error("Conversion error:", error);
      await MySwal.fire({
        icon: "error",
        title: "Conversion Failed",
        text: "Could not convert the lead to a customer.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-center">
        <Info className="text-orange-300" size={90} strokeWidth={1} />
      </div>
      <h3 className="text-2xl text-center px-3 font-semibold text-gray-50 mx-auto">
        Are You Sure You Want To Convert This Lead To Customer?
      </h3>
      <ul className="flex items-center justify-center gap-4">
        <li>
          <Button onClick={handleConvert} disabled={loading}>
            {loading ? "Converting..." : "Yes Convert"}
          </Button>
        </li>
        <li>
          <Button variant="destructive" onClick={closeModal}>
            Cancel
          </Button>
        </li>
      </ul>
    </div>
  );
}
export function LeadFollowUp() {
  const { data, closeModal, setFormActions, setSubmitLabel } = useModalStore();
  const leadId = data?._id;

  const [comment, setComment] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState("12:00");
  const [attachmentUrl, setAttachmentUrl] = useState<string | undefined>();
  const [audioAttachmentUrl, setAudioAttachmentUrl] = useState<
    string | undefined
  >();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!comment || !selectedDate || !selectedTime) {
      Swal.fire("Error", "All fields are required", "error");
      return;
    }

    const [hours, minutes] = selectedTime.split(":");
    const followUpDate = new Date(selectedDate);
    followUpDate.setHours(Number(hours), Number(minutes));

    setIsSubmitting(true);
    try {
      await leadsApi.createNewFollowup({
        leadId,
        comment,
        nextFollowUp: followUpDate.toISOString(),
        attachmentUrl,
        audioAttachmentUrl,
      });

      console.warn("payload", {
        leadId,
        comment,
        nextFollowUp: followUpDate.toISOString(),
        attachmentUrl,
        audioAttachmentUrl,
      });

      Swal.fire("Success", "Follow-up added successfully", "success");
      closeModal();
    } catch (error: any) {
      Swal.fire("Error", error.message || "Failed to add follow-up", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    setSubmitLabel?.("Add Follow Up");
  }, []);

  useEffect(() => {
    setFormActions?.({
      onSubmit: handleSubmit,
      onCancel: () => closeModal(),
      canSubmit: !!comment && !!selectedDate && !!selectedTime,
      isSubmitting,
    });
  }, [
    comment,
    selectedDate,
    selectedTime,
    isSubmitting,
    attachmentUrl,
    audioAttachmentUrl,
  ]);

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm text-gray-300 block mb-1">
          Next Follow-Up Date:
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal border-gray-500 bg-zinc-900 text-white hover:bg-zinc-800",
                !selectedDate && "text-muted-foreground"
              )}
              disabled={isSubmitting}
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
              {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-zinc-900 text-white border border-gray-600">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Input
          type="time"
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
          disabled={isSubmitting}
          className="mt-2 w-full"
        />
      </div>
      <div>
        <label className="text-sm text-gray-300 block mb-1">Comment:</label>
        <Textarea
          placeholder="Enter your follow-up comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={isSubmitting}
          className="w-full"
        />
      </div>

      <div className="flex gap-4">
        <div className="w-1/2">
          <label className="text-sm text-gray-300 block mb-1">
            Upload File:
          </label>
          <FileUploader
            onUploadSuccess={setAttachmentUrl}
            disabled={isSubmitting}
          />
        </div>

        <div className="w-1/2">
          <label className="text-sm text-gray-300 block mb-1">
            Record Audio:
          </label>
          <AudioRecorderUploader
            onUploadSuccess={setAudioAttachmentUrl}
            disabled={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}

export function LeadStatus() {
  const { data, closeModal } = useModalStore();
  const leadId = data?._id;
  const [search, setSearch] = useState("");

  const [statuses, setStatuses] = useState<StatusItem[]>([]);
  const [selectedStatusId, setSelectedStatusId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStatuses() {
      try {
        const res =
          (await statusApi.status()) as unknown as AxiosResponse<StatusResponse>;
        setStatuses(res.data.data); // Already StatusItem[]
      } catch (err) {
        setError("Failed to load statuses");
      }
    }

    fetchStatuses();
  }, []);

  const assignStatus = async () => {
    if (!leadId || !selectedStatusId) return;

    setIsSubmitting(true);
    setError(null);
    try {
      await leadsApi.updateLeadStatus({
        leadId,
        statusId: selectedStatusId,
      });
      closeModal(); // close on success
    } catch (err) {
      setError("Failed to update status. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search status..."
        disabled={isSubmitting}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full"
      />

      <ul className="min-h-[200px] max-h-[150px] overflow-y-auto mt-3 space-y-2">
        {statuses
          .filter((status) =>
            status.title.toLowerCase().includes(search.toLowerCase())
          )
          .map((status) => (
            <li key={status._id} className="flex items-center gap-2">
              <input
                type="radio"
                id={status._id}
                name="status"
                checked={selectedStatusId === status._id}
                onChange={() => setSelectedStatusId(status._id)}
                disabled={isSubmitting}
              />
              <label htmlFor={status._id} className="text-sm">
                {status.title}
              </label>
            </li>
          ))}
      </ul>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <Button
        className="bg-green-600 hover:bg-green-700 w-full"
        disabled={isSubmitting || !selectedStatusId}
        onClick={assignStatus}
      >
        {isSubmitting ? "Updating..." : "Update Status"}
      </Button>
    </div>
  );
}

export function LeadDetail() {
  const { data } = useModalStore();
  const leadId = data?._id;
  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!leadId) return;

    const fetchLeadInfo = async () => {
      try {
        const response = await leadsApi.getLeadInfo({ leadId });
        setLead(response.data);
      } catch (error) {
        console.error("Failed to fetch lead info", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeadInfo();
  }, [leadId]);

  if (loading) {
    return (
      <div className="p-4 text-center text-white">Loading lead details...</div>
    );
  }

  if (!lead) {
    return <div className="p-4 text-center text-red-500">Lead not found.</div>;
  }

  // Extract fields

  return (
    <div className="min-h-[400px] max-h-[450px] overflow-y-auto ">
      {/* Top Action Icons (static for now) */}
      <ul className="flex items-center justify-center gap-6">
        <li className="cursor-pointer">
          <SquarePen size={26} strokeWidth={1.4} />
        </li>
        <li className="cursor-pointer">
          <Send size={26} strokeWidth={1.4} />
        </li>
        <li className="cursor-pointer">
          <TrendingUp size={26} strokeWidth={1.4} />
        </li>
        <li className="cursor-pointer">
          <UserPlus size={26} strokeWidth={1.4} />
        </li>
        <li className="cursor-pointer">
          <Trash size={26} strokeWidth={1.4} />
        </li>
        <li className="cursor-pointer">
          <Tag size={26} strokeWidth={1.4} />
        </li>
        <li className="cursor-pointer">
          <RefreshCcw size={26} strokeWidth={1.4} />
        </li>
        <li className="cursor-pointer">
          <EllipsisVertical size={26} strokeWidth={1.4} />
        </li>
      </ul>

      {/* Tabs */}
      <Tabs defaultValue="details" className="mt-4">
        <TabsList className="flex flex-wrap gap-2 p-1 w-[700px] mx-auto ">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="followup">
            Follow Up ({lead.data.follow_ups?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="history">
            History ({lead.data.logs?.length || 0})
          </TabsTrigger>
          {/* <TabsTrigger value="task">Task</TabsTrigger>
          <TabsTrigger value="reminder">Reminder</TabsTrigger>
          <TabsTrigger value="meeting">Meeting</TabsTrigger>
          <TabsTrigger value="quotation">Quotation</TabsTrigger>
          <TabsTrigger value="invoice">Invoice</TabsTrigger> */}
        </TabsList>

        <TabsContent value="details">
          <div className="grid grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="border border-gray-700 rounded">
              <h3 className="font-semibold text-white mb-2 bg-[var(--primary)] p-4 text-center">
                Lead Information
              </h3>
              <div className="p-4">
                <p className="text-sm text-gray-300 mb-2">
                  <b>Name:</b> {lead.data.name}
                </p>
                <p className="text-sm text-gray-300 mb-2">
                  <b>Company:</b> {lead.data.company_name || "-"}
                </p>
                <p className="text-sm text-gray-300 mb-2">
                  <b>Phone:</b> {lead.data.phone_number}
                </p>
                <p className="text-sm text-gray-300 mb-2">
                  <b>Whatsapp:</b> {lead.data.meta.whatsapp || "-"}
                </p>
                <p className="text-sm text-gray-300 mb-2">
                  <b>Email:</b> {lead.data.email || "-"}
                </p>
                <p className="text-sm text-gray-300 mb-2">
                  <b>Address:</b> {lead.data.address || "-"}
                </p>

                <p className="text-sm text-gray-300 mb-2">
                  <b>Comment:</b> {lead.data.comment || "-"}
                </p>
                <p className="text-sm text-gray-300 mb-2">
                  <b>Reference:</b> {lead.data.reference || "-"}
                </p>

                <p className="text-sm text-gray-300 mb-2">
                  <b>Course selected:</b> {lead.data.meta.course || "-"}
                </p>
                <p className="text-sm text-gray-300 mb-2">
                  <b>Stream Selected:</b> {lead.data.meta.stream || "-"}
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="border border-gray-700 rounded">
              <h3 className="font-semibold text-white mb-2 bg-[var(--primary)] p-4 text-center">
                General Information
              </h3>
              <div className="p-4">
                <p className="text-sm text-gray-300 mb-2">
                  <b>Date:</b> {new Date(lead.data.createdAt).toLocaleString()}
                </p>
                <p className="text-sm text-gray-300 mb-2">
                  <b>Status:</b> {lead.data.status.title || "N/A"}
                </p>
                <p className="text-sm text-gray-300 mb-2">
                  <b>Source:</b> {lead?.data?.meta?.source?.title || "N/A"}
                </p>
                <p className="text-sm text-gray-300 mb-2">
                  <b>Labels:</b>{" "}
                  <div className="flex gap-2 flex-wrap mt-1">
                    {lead.data.labels.length > 0
                      ? lead.data.labels.map((lbl: any) => (
                          <span
                            key={lbl._id}
                            className="bg-purple-700 px-2 py-1 rounded text-xs"
                          >
                            {lbl.title}
                          </span>
                        ))
                      : "-"}
                  </div>
                </p>
                <p className="text-sm text-gray-300 mb-2">
                  <b>Created By:</b> {lead.data.assigned_by?.name || ""}
                </p>
                <p className="text-sm text-gray-300 mb-2">
                  <b>Assign To:</b> {lead.data.assigned_to?.name || "N/A"}
                </p>
              </div>
            </div>

            {/* <div className="border border-gray-700 rounded">
              <h3 className="font-semibold text-white mb-2 bg-[#3a3285] p-4 text-center">
                Lead Meta Data
              </h3>
              <div className="p-4">
                <p className="text-sm text-gray-300 mb-2">
                  <b>Enriched Location (City):</b>{" "}
                  {lead.data.meta.location.city}
                </p>
                <p className="text-sm text-gray-300 mb-2">
                  <b>Enriched Location (Country):</b>{" "}
                  {lead.data.meta.location.country}
                </p>
                <p className="text-sm text-gray-300 mb-2">
                  <b>Enriched Location (Detailed Address):</b>{" "}
                  {lead.data.meta.location.detailed_lead_address}
                </p>

                <p className="text-sm text-gray-300 mb-2">
                  <b>Enriched Location (Region of Origin):</b>{" "}
                  {lead.data.meta.location.region}
                </p>
              </div>
            </div> */}
          </div>
        </TabsContent>

        {/* Other tabs placeholder */}
        <TabsContent value="followup" className="mt-4">
          {lead.data.follow_ups && lead.data.follow_ups.length > 0 ? (
            <div className="space-y-4">
              {lead.data.follow_ups
                .sort(
                  (a: any, b: any) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .map((followup: any, index: number) => (
                  <details
                    key={followup._id || index}
                    className="border border-gray-700 rounded bg-[#1f1f2f] text-white"
                  >
                    <summary className="cursor-pointer px-4 py-2 hover:bg-gray-800 transition-all font-medium flex justify-between items-center">
                      <span>{lead.data.assigned_to.name}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(followup.createdAt).toLocaleString()}
                      </span>
                    </summary>
                    <div className="px-4 py-3 space-y-2">
                      <div>
                        <b className="text-gray-300">Next Follow-Up:</b>{" "}
                        <span className="text-sm text-gray-400">
                          {new Date(
                            followup.next_followup_date
                          ).toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <b className="text-gray-300">Comment:</b>{" "}
                        <p className="text-sm text-gray-200">
                          {followup.comment}
                        </p>
                      </div>

                      {followup.meta?.attachment_url && (
                        <div>
                          <b className="text-gray-300">Attachment:</b>{" "}
                          <a
                            href={followup.meta.attachment_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 underline text-sm"
                          >
                            View File
                          </a>
                        </div>
                      )}

                      {followup.meta?.audio_attachment_url && (
                        <div>
                          <b className="text-gray-300">Audio:</b>
                          <audio
                            controls
                            preload="metadata"
                            className="mt-1 w-full rounded"
                          >
                            <source
                              src={followup.meta.audio_attachment_url}
                              type="audio/webm"
                            />
                            Your browser does not support the audio element.
                          </audio>
                        </div>
                      )}
                    </div>
                  </details>
                ))}
            </div>
          ) : (
            <p className="text-white text-center">No follow-ups available.</p>
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          {lead.data.logs && lead.data.logs.length > 0 ? (
            <ul className="space-y-4">
              {[...lead.data.logs]
                .sort(
                  (a: any, b: any) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .map((log: any, index: number) => (
                  <li
                    key={log._id || index}
                    className="border border-gray-700 rounded p-4 bg-[#1f1f2f] text-white"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-base">{log.title}</h4>
                      <span className="text-xs text-gray-400">
                        {new Date(log.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300">{log.description}</p>
                  </li>
                ))}
            </ul>
          ) : (
            <p className="text-white text-center">No history available.</p>
          )}
        </TabsContent>

        {/* <TabsContent value="task" className="mt-4">
          <p>No tasks assigned.</p>
        </TabsContent>
        <TabsContent value="reminder" className="mt-4">
          <p>No reminders set.</p>
        </TabsContent>
        <TabsContent value="meeting" className="mt-4">
          <p>No meetings scheduled.</p>
        </TabsContent>
        <TabsContent value="quotation" className="mt-4">
          <p>No quotations generated.</p>
        </TabsContent>
        <TabsContent value="invoice" className="mt-4">
          <p>No invoices available.</p>
        </TabsContent> */}
      </Tabs>
    </div>
  );
}
