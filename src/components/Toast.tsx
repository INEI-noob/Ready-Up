import { useState, useEffect, useCallback, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error" | "info";
interface ToastEntry {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

const VARIANT_CONFIG: Record<ToastVariant, { icon: React.ElementType; bg: string; border: string; text: string }> = {
  success: {
    icon: CheckCircle,
    bg: "bg-pastelMint/15",
    border: "border-pastelMint/30",
    text: "text-okDark",
  },
  error: {
    icon: AlertCircle,
    bg: "bg-pastelPink/15",
    border: "border-pastelPink/30",
    text: "text-pink",
  },
  info: {
    icon: Info,
    bg: "bg-pastelBlue/15",
    border: "border-pastelBlue/30",
    text: "text-pastelBlue",
  },
};

let nextId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);

  const toast = useCallback((message: string, variant: ToastVariant = "info") => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, message, variant }]);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast container */}
      <div className="fixed right-4 top-4 z-[100] flex flex-col gap-2" role="status" aria-live="polite">
        <AnimatePresence>
          {toasts.map((t) => (
            <ToastItem key={t.id} entry={t} onDismiss={() => dismiss(t.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ entry, onDismiss }: { entry: ToastEntry; onDismiss: () => void }) {
  const { icon: Icon, bg, border, text } = VARIANT_CONFIG[entry.variant];

  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 40, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={cn(
        "flex items-center gap-2.5 rounded-2xl border px-4 py-2.5 shadow-pastel backdrop-blur-md",
        bg,
        border
      )}
    >
      <Icon className={cn("h-4 w-4 shrink-0", text)} />
      <span className={cn("text-[13px] font-semibold", text)}>{entry.message}</span>
      <button onClick={onDismiss} className="ml-2 shrink-0 text-inkDim/40 transition-colors hover:text-inkDim">
        <X className="h-3 w-3" />
      </button>
    </motion.div>
  );
}
