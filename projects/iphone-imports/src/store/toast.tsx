"use client";

import { create } from "zustand";
import { useEffect } from "react";
import { CheckCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Toast {
  id: string;
  message: string;
}

interface ToastState {
  toasts: Toast[];
  add: (message: string) => void;
  remove: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  add: (message) => {
    const id = crypto.randomUUID();
    set((s) => ({ toasts: [...s.toasts, { id, message }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 3000);
  },
  remove: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const remove = useToastStore((s) => s.remove);

  if (!toasts.length) return null;

  return (
    <div
      className="fixed bottom-20 right-4 z-[100] flex flex-col gap-2 md:bottom-6"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "flex items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3 shadow-lg",
            "animate-in fade-in slide-in-from-bottom-2 duration-300"
          )}
        >
          <CheckCircle className="h-5 w-5 shrink-0 text-brand-yellow" />
          <span className="text-sm font-medium text-brand-black">{toast.message}</span>
          <button
            onClick={() => remove(toast.id)}
            className="ml-1 rounded-full p-1 text-brand-gray hover:bg-brand-light"
            aria-label="Fechar notificação"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

export function useToast() {
  const add = useToastStore((s) => s.add);
  return { toast: add };
}
