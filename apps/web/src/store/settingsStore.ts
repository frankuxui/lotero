import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DateFormatPreference } from "@/lib/formatters/date";

export type ViewMode = "auto" | "cards" | "table";

interface SettingsState {
  dateFormat: DateFormatPreference;
  itemsPerPage: number;
  defaultGame: string | null;
  viewMode: ViewMode;
  confirmBeforeDelete: boolean;
  setDateFormat: (value: DateFormatPreference) => void;
  setItemsPerPage: (value: number) => void;
  setDefaultGame: (value: string | null) => void;
  setViewMode: (value: ViewMode) => void;
  setConfirmBeforeDelete: (value: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      dateFormat: "dd/mm/yyyy",
      itemsPerPage: 10,
      defaultGame: null,
      viewMode: "auto",
      confirmBeforeDelete: true,
      setDateFormat: (dateFormat) => set({ dateFormat }),
      setItemsPerPage: (itemsPerPage) => set({ itemsPerPage }),
      setDefaultGame: (defaultGame) => set({ defaultGame }),
      setViewMode: (viewMode) => set({ viewMode }),
      setConfirmBeforeDelete: (confirmBeforeDelete) => set({ confirmBeforeDelete }),
    }),
    { name: "lotero-settings" },
  ),
);
