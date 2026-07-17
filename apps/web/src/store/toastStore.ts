import { toast as sonnerToast } from "sonner";

export interface ToastItem {
  title: string;
  description?: string;
  variant?: "default" | "success" | "error";
}

export function toast({ title, description, variant }: ToastItem): void {
  const options = description ? { description } : undefined;

  if (variant === "success") {
    sonnerToast.success(title, options);
    return;
  }
  if (variant === "error") {
    sonnerToast.error(title, options);
    return;
  }
  sonnerToast(title, options);
}
