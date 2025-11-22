import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { wapmonkeyService } from "../services/Wapmonkey.service";
import { queryClient } from "@/utils/client";

export function useCreateWapmonkey() {
  const mutation = useMutation({
    mutationFn: async (payload: { wapmonkey_key: string }) => {
      return await wapmonkeyService.createWapmonkeyEntry(payload);
    },

    onError: (error: any) => {
      console.error("❌ Failed to save WapMonkey API key:", error);

      const message = error?.message || "Failed to save WapMonkey API key.";

      toast.error(message);
    },

    onSuccess: (data: any) => {
      toast.success(data.message);

      // Re-fetch user so UI updates instantly
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  return {
    saveApiKey: mutation.mutate,
    isSaving: mutation.isPending,
  };
}
