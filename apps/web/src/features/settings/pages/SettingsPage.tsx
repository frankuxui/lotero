import { useMemo } from "react";
import { GameSelector } from "@/components/shared/GameSelector";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useGames } from "@/hooks/useGames";
import { useSettingsStore } from "@/store/settingsStore";

export default function SettingsPage() {
  const gamesQuery = useGames();
  const games = useMemo(() => gamesQuery.data ?? [], [gamesQuery.data]);

  const dateFormat = useSettingsStore((state) => state.dateFormat);
  const itemsPerPage = useSettingsStore((state) => state.itemsPerPage);
  const defaultGame = useSettingsStore((state) => state.defaultGame);
  const viewMode = useSettingsStore((state) => state.viewMode);
  const theme = useSettingsStore((state) => state.theme);
  const confirmBeforeDelete = useSettingsStore((state) => state.confirmBeforeDelete);

  const setDateFormat = useSettingsStore((state) => state.setDateFormat);
  const setItemsPerPage = useSettingsStore((state) => state.setItemsPerPage);
  const setDefaultGame = useSettingsStore((state) => state.setDefaultGame);
  const setViewMode = useSettingsStore((state) => state.setViewMode);
  const setTheme = useSettingsStore((state) => state.setTheme);
  const setConfirmBeforeDelete = useSettingsStore((state) => state.setConfirmBeforeDelete);

  return (
    <div className="w-full max-w-xl mx-auto">
      <PageHeader title="Configuración" description="Preferencias locales de la aplicación, guardadas en este dispositivo." />

      <div className="flex flex-col w-full gap-8">
        <section className="w-full">
          <SectionHeader title="Visualización" />
          <Card className="w-full p-8">
            <CardContent className="flex flex-col gap-5">
              <div className="flex flex-col gap-4 ">
                <Label htmlFor="settings-date-format">Formato de fecha</Label>
                <Select id="settings-date-format" value={dateFormat} onChange={(event) => setDateFormat(event.target.value as "dd/mm/yyyy" | "yyyy-mm-dd" | "long")}>
                  <option value="dd/mm/yyyy">DD/MM/AAAA</option>
                  <option value="yyyy-mm-dd">AAAA-MM-DD</option>
                  <option value="long">Fecha larga — 23 de julio de 2026</option>
                </Select>
              </div>

              <div className="flex flex-col gap-4 ">
                <Label htmlFor="settings-items-per-page">Elementos por página</Label>
                <Select id="settings-items-per-page" value={String(itemsPerPage)} onChange={(event) => setItemsPerPage(Number(event.target.value))}>
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </Select>
              </div>

              <div className="flex flex-col gap-4 ">
                <Label htmlFor="settings-view-mode">Modo de visualización de listados</Label>
                <Select id="settings-view-mode" value={viewMode} onChange={(event) => setViewMode(event.target.value as "auto" | "cards" | "table")}>
                  <option value="auto">Automático (tabla en escritorio, tarjetas en móvil)</option>
                  <option value="cards">Siempre tarjetas</option>
                  <option value="table">Siempre tabla</option>
                </Select>
              </div>

              <div className="flex flex-col gap-4 ">
                <Label htmlFor="settings-theme">Tema</Label>
                <Select id="settings-theme" value={theme} onChange={(event) => setTheme(event.target.value as "system" | "light" | "dark")}>
                  <option value="system">Automático (según el sistema)</option>
                  <option value="light">Claro</option>
                  <option value="dark">Oscuro</option>
                </Select>
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <SectionHeader title="Apuestas y sorteos" />
          <Card className="w-full p-8">
            <CardContent className="flex flex-col gap-5">
              <div className="flex flex-col gap-4">
                <Label htmlFor="settings-default-game">Juego predeterminado</Label>
                <GameSelector id="settings-default-game" games={games} value={defaultGame ?? ""} onChange={(value) => setDefaultGame(value || null)} allowAll allowAllLabel="Sin preferencia" />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <Label htmlFor="settings-confirm-delete">Confirmar antes de eliminar</Label>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Muestra un diálogo de confirmación al eliminar apuestas o sorteos.</p>
                </div>
                <Switch id="settings-confirm-delete" checked={confirmBeforeDelete} onCheckedChange={setConfirmBeforeDelete} />
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
