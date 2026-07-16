import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DateFormatPreference } from "@/lib/formatters/date";

export type ViewMode = "auto" | "cards" | "table";
export type ThemePreference = "system" | "light" | "dark";

interface SettingsState {
  dateFormat: DateFormatPreference;
  itemsPerPage: number;
  defaultGame: string | null;
  viewMode: ViewMode;
  theme: ThemePreference;
  confirmBeforeDelete: boolean;
  setDateFormat: (value: DateFormatPreference) => void;
  setItemsPerPage: (value: number) => void;
  setDefaultGame: (value: string | null) => void;
  setViewMode: (value: ViewMode) => void;
  setTheme: (value: ThemePreference) => void;
  setConfirmBeforeDelete: (value: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      dateFormat: "dd/mm/yyyy",
      itemsPerPage: 10,
      defaultGame: null,
      viewMode: "auto",
      theme: "system",
      confirmBeforeDelete: true,
      setDateFormat: (dateFormat) => set({ dateFormat }),
      setItemsPerPage: (itemsPerPage) => set({ itemsPerPage }),
      setDefaultGame: (defaultGame) => set({ defaultGame }),
      setViewMode: (viewMode) => set({ viewMode }),
      setTheme: (theme) => set({ theme }),
      setConfirmBeforeDelete: (confirmBeforeDelete) => set({ confirmBeforeDelete }),
    }),
    { name: "lotero-settings" },
  ),
);
