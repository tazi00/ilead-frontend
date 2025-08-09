import type React from "react";
import { create } from "zustand";

type FormActions = {
  onSubmit: () => void;
  onCancel: () => void;
  canSubmit: boolean;
  isSubmitting: boolean;
};

type ModalType = "info" | "action" | "form";

type ModalStore = {
  isOpen: boolean;
  modalContent: React.ReactNode;
  modalTitle?: React.ReactNode;
  modalSize?: "sm" | "md" | "lg" | "xl";
  modalType: ModalType;
  data: any;
  formActions?: FormActions;
  customActions?: React.ReactNode;
  openModal: (params: {
    content: React.ReactNode;
    type?: ModalType;
    customActions?: React.ReactNode;
  }) => void;
  setModalSize?: (size: "sm" | "md" | "lg" | "xl") => void;
  setModalTitle?: (title: string | null) => void;
  setData?: (data: any) => void;
  setFormActions?: (actions: FormActions) => void;
  closeModal: () => void;
  submitLabel?: string;
  setSubmitLabel?: (label: string | undefined) => void;
};

export const useModalStore = create<ModalStore>((set) => ({
  isOpen: false,
  modalContent: null,
  modalType: "info",
  data: null,
  formActions: undefined,
  customActions: undefined,
  modalSize: "sm",
  setData: (data) => set({ data }),
  openModal: ({ content, type = "info", customActions }) =>
    set({
      isOpen: true,
      modalContent: content,
      modalType: type,
      customActions,
    }),
  setModalSize: (size) => set({ modalSize: size }),

  setModalTitle: (title) => set({ modalTitle: title }),
  setFormActions: (actions) => set({ formActions: actions }),
  closeModal: () =>
    set({
      isOpen: false,
      modalContent: null,
      modalType: "info",
      formActions: undefined,
      customActions: undefined,
      modalTitle: undefined,
      submitLabel: undefined,
    }),

  submitLabel: undefined,
  setSubmitLabel: (label) => set({ submitLabel: label }),
}));
