"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, X, Info } from "lucide-react";
import { Portal } from "@/components/Portal";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  title: string;
  message?: string;
  duration?: number;
}

type ToastListener = (toasts: ToastMessage[]) => void;

let toastMessages: ToastMessage[] = [];
let listeners: ToastListener[] = [];

function notifyListeners() {
  listeners.forEach((listener) => listener([...toastMessages]));
}

export const toast = {
  show: (type: "success" | "error" | "info", title: string, message?: string, duration = 4000) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    const newToast: ToastMessage = { id, type, title, message, duration };
    toastMessages = [...toastMessages, newToast];
    notifyListeners();

    if (duration > 0) {
      setTimeout(() => {
        toast.dismiss(id);
      }, duration);
    }
    return id;
  },
  success: (title: string, message?: string, duration?: number) => toast.show("success", title, message, duration),
  error: (title: string, message?: string, duration?: number) => toast.show("error", title, message, duration),
  info: (title: string, message?: string, duration?: number) => toast.show("info", title, message, duration),
  dismiss: (id: string) => {
    toastMessages = toastMessages.filter((t) => t.id !== id);
    notifyListeners();
  },
};

export function ToastContainer({ toasts: propsToasts, onDismiss }: { toasts?: ToastMessage[]; onDismiss?: (id: string) => void }) {
  const [activeToasts, setActiveToasts] = useState<ToastMessage[]>(propsToasts || []);

  useEffect(() => {
    if (propsToasts) {
      setActiveToasts(propsToasts);
      return;
    }
    const handleChange = (newToasts: ToastMessage[]) => {
      setActiveToasts(newToasts);
    };
    listeners.push(handleChange);
    return () => {
      listeners = listeners.filter((l) => l !== handleChange);
    };
  }, [propsToasts]);

  if (activeToasts.length === 0) return null;

  return (
    <Portal>
      <div className="fixed bottom-6 right-6 z-[99999] flex flex-col gap-3 max-w-sm w-full select-none pointer-events-none">
        {activeToasts.map((t) => (
          <div
            key={t.id}
            className={`p-4 rounded-2xl border shadow-2xl flex items-start gap-3 transition-all animate-in slide-in-from-bottom-5 duration-200 pointer-events-auto backdrop-blur-md ${
              t.type === "success"
                ? "bg-emerald-600/95 dark:bg-emerald-950/95 text-white border-emerald-500/40 shadow-emerald-600/20"
                : t.type === "error"
                ? "bg-rose-600/95 dark:bg-rose-950/95 text-white border-rose-500/40 shadow-rose-600/20"
                : "bg-slate-900/95 dark:bg-slate-900/95 text-white border-slate-700/60 shadow-slate-950/30"
            }`}
          >
            {t.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-white shrink-0 mt-0.5" />
            ) : t.type === "error" ? (
              <AlertCircle className="w-5 h-5 text-white shrink-0 mt-0.5" />
            ) : (
              <Info className="w-5 h-5 text-white shrink-0 mt-0.5" />
            )}

            <div className="flex-1 space-y-0.5 min-w-0">
              <h4 className="text-xs font-black tracking-wide truncate">{t.title}</h4>
              {t.message && <p className="text-[11px] font-semibold opacity-90 leading-snug line-clamp-2">{t.message}</p>}
            </div>

            <button
              type="button"
              onClick={() => {
                if (onDismiss) onDismiss(t.id);
                else toast.dismiss(t.id);
              }}
              className="text-white/70 hover:text-white transition-colors cursor-pointer p-0.5 rounded-lg shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </Portal>
  );
}
