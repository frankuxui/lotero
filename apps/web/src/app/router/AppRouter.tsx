import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { AppShell } from "@/app/layouts/AppShell";

const DashboardPage = lazy(() => import("@/features/dashboard/pages/DashboardPage"));
const BetsListPage = lazy(() => import("@/features/bets/pages/BetsListPage"));
const BetFormPage = lazy(() => import("@/features/bets/pages/BetFormPage"));
const BetDetailPage = lazy(() => import("@/features/bets/pages/BetDetailPage"));
const DrawsListPage = lazy(() => import("@/features/draws/pages/DrawsListPage"));
const DrawFormPage = lazy(() => import("@/features/draws/pages/DrawFormPage"));
const DrawDetailPage = lazy(() => import("@/features/draws/pages/DrawDetailPage"));
const HistoryPage = lazy(() => import("@/features/history/pages/HistoryPage"));
const ComparePage = lazy(() => import("@/features/comparison/pages/ComparePage"));
const StatisticsPage = lazy(() => import("@/features/statistics/pages/StatisticsPage"));
const NumbersPage = lazy(() => import("@/features/numbers/pages/NumbersPage"));
const NumberDetailPage = lazy(() => import("@/features/numbers/pages/NumberDetailPage"));
const SuggestionsHistoryPage = lazy(() => import("@/features/suggestions/pages/SuggestionsHistoryPage"));
const SettingsPage = lazy(() => import("@/features/settings/pages/SettingsPage"));
const NotFoundPage = lazy(() => import("@/features/not-found/NotFoundPage"));

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<DashboardPage />} />
        <Route path="bets" element={<BetsListPage />} />
        <Route path="bets/new" element={<BetFormPage />} />
        <Route path="bets/:id" element={<BetDetailPage />} />
        <Route path="bets/:id/edit" element={<BetFormPage />} />
        <Route path="draws" element={<DrawsListPage />} />
        <Route path="draws/new" element={<DrawFormPage />} />
        <Route path="draws/:id" element={<DrawDetailPage />} />
        <Route path="draws/:id/edit" element={<DrawFormPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="compare" element={<ComparePage />} />
        <Route path="statistics" element={<StatisticsPage />} />
        <Route path="numbers" element={<NumbersPage />} />
        <Route path="numbers/:number" element={<NumberDetailPage />} />
        <Route path="suggestions" element={<SuggestionsHistoryPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
