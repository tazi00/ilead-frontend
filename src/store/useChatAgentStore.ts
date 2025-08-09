import { create } from "zustand";
import { chatAgentService } from "@/features/leads/services/ChatAgents.service";

export const useChatAgentStore = create((set: any) => ({
  chatAgents: [],
  fetchChatAgents: async () => {
    const res = await chatAgentService.fetchPaginatedChatAgents();

    if (res.data.status === "SUCCESS") {
      set({ chatAgents: res.data.data.chatAgents }); // <- use res.data.chatAgents, not res.data
    }
  },
}));
