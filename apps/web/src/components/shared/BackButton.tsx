import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function BackButton({ label = "Volver", fallback = "/" }: { label?: string; fallback?: string }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex gap-2 h-10 px-6 flex-none items-center justify-center rounded-full font-semibold text-sm bg bg-secondary hover:bg-secondary-foreground/10 text-secondary-foreground transition-colors cursor-pointer"
    >
      <ArrowLeft aria-hidden="true" className="size-4" />
      {label}
    </button>
  );
}
