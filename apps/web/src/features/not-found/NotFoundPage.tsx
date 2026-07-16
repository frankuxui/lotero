import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">Error 404</p>
      <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-50">Página no encontrada</h1>
      <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">
        La página que buscas no existe o ha sido movida.
      </p>
      <div className="mt-2 flex gap-2">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Volver atrás
        </Button>
        <Button asChild>
          <Link to="/">Ir al inicio</Link>
        </Button>
      </div>
    </div>
  );
}
