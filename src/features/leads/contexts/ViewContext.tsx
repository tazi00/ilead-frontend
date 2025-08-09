import { createContext, useContext } from "react";

export const ViewContext = createContext<{
  isTableView: boolean;
  setIsTableView: (val: boolean) => void;
} | null>(null);

export function useViewContext() {
  const context = useContext(ViewContext);
  if (!context) {
    throw new Error("useViewContext must be used within ViewContext.Provider");
  }
  return context;
}
