"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModalStore } from "@/store/useModalStore";
import { Button } from "../ui/button";

export function Modal() {
  const {
    isOpen,
    closeModal,
    modalContent,
    modalTitle,
    modalType,
    formActions,
    customActions,
    modalSize,
    submitLabel,
  } = useModalStore();

  const handleSubmit = () => {
    if (formActions?.onSubmit) {
      formActions.onSubmit();
      // DON'T close modal here - let the component handle it based on success
    }
  };

  const handleCancel = () => {
    if (formActions?.onCancel) {
      formActions.onCancel();
    }
    closeModal();
  };

  // Determine if footer should be shown
  const showFooter =
    modalType === "form" || modalType === "action" || customActions;

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent
        className={`${modalSize === "sm" ? "max-w-lg" : "w-[1300px] max-w-[1300px]"}`}
      >
        {modalTitle && (
          <DialogHeader className="bg-[#3a3285] text-white">
            <DialogTitle>{modalTitle}</DialogTitle>
          </DialogHeader>
        )}

        <div className="px-3 py-0">{modalContent}</div>

        {(modalTitle || showFooter) && (
          <DialogFooter>
            <div className="flex items-center justify-end gap-2 border-t border-gray-600 w-full py-4 px-5">
              {/* Custom actions (for specific modals) */}
              {customActions && customActions}

              {/* Form actions (for form submissions) */}
              {modalType === "form" && !customActions && (
                <>
                  <Button
                    className="text-white bg-blue-600 hover:bg-blue-700"
                    onClick={handleSubmit}
                    disabled={
                      !formActions?.canSubmit || formActions?.isSubmitting
                    }
                  >
                    {formActions?.isSubmitting
                      ? `${submitLabel || "Submit"}...`
                      : submitLabel || "Submit"}
                  </Button>
                  <Button
                    className="bg-gray-500 hover:bg-gray-600"
                    onClick={handleCancel}
                    disabled={formActions?.isSubmitting} // Disable cancel while processing
                  >
                    Cancel
                  </Button>
                </>
              )}

              {/* Simple action modal (just close button) */}
              {modalType === "action" && !customActions && (
                <Button onClick={closeModal}>Close</Button>
              )}
            </div>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
