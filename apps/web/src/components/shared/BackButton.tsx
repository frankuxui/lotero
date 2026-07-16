import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

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
    <Button variant="ghost" size="sm" onClick={handleClick}>
      <ArrowLeft aria-hidden="true" />
      {label}
    </Button>
  );
}
