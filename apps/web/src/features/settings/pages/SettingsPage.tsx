import { useMemo } from "react";
import { GameSelector } from "@/components/shared/GameSelector";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useGames } from "@/hooks/useGames";
import { useSettingsStore } from "@/store/settingsStore";
import { PageHeader } from "@/components/shared/PageHeader";

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
      <PageHeader
        title="Configuracion"
        description="En este apartado puedes configurar tus preferencias de visualización y comportamiento de la aplicación."
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" className="size-12">
            <path
              fill="url(#a)"
              fillRule="evenodd"
              d="M6.591 0a1.51 1.51 0 0 0-1.399.951l0 .001-.377.95-1.16.667-1.016-.155a1.51 1.51 0 0 0-1.528.733l-.409.704A1.495 1.495 0 0 0 .83 5.538l.641.8v1.324l-.641.8a1.5 1.5 0 0 0-.128 1.687l.41.704a1.5 1.5 0 0 0 1.527.733l1.02-.154 1.155.663.376.953A1.5 1.5 0 0 0 6.588 14h.82a1.51 1.51 0 0 0 1.398-.952l.375-.953 1.156-.663 1.02.154a1.51 1.51 0 0 0 1.527-.733l.41-.704a1.49 1.49 0 0 0-.128-1.688l-.642-.799V6.338l.642-.8a1.5 1.5 0 0 0 .127-1.687l-.409-.704a1.5 1.5 0 0 0-1.528-.733l-1.016.154-1.159-.667-.377-.949A1.5 1.5 0 0 0 7.403 0l-.406 0zM5.285 5.287c.412-.413 1.003-.613 1.713-.613s1.3.2 1.713.613c.412.412.613 1.002.613 1.713 0 .71-.2 1.3-.613 1.713-.413.412-1.003.613-1.713.613s-1.3-.2-1.713-.613S4.672 7.71 4.672 7s.2-1.3.613-1.713"
              clipRule="evenodd"
            ></path>
            <defs>
              <linearGradient id="a" x1="2.624" x2="13.473" y1="2.692" y2="8.272" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0b00f2"></stop>
                <stop offset="1" stopColor="#e105b0"></stop>
              </linearGradient>
            </defs>
          </svg>
        }
      />

      <div className="flex flex-col w-full gap-8">
        <section className="w-full">
          <Card className="w-full p-8 mt-8">
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
