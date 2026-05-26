"use client";

import { AnimatePresence, motion } from "framer-motion";
import { memo } from "react";
import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion";
import { useMounted } from "@/hooks/use-mounted";
import { useOsRuntimeStore } from "@/store/os-runtime-store";
import { easeLuxury } from "@/lib/motion/transitions";

function AiAssistantLayerInner() {
  const mounted = useMounted();
  const reduceMotion = useHydratedReducedMotion();
  const aiMessage = useOsRuntimeStore((s) => s.aiMessage);
  const aiVisible = useOsRuntimeStore((s) => s.aiVisible);
  const neuralState = useOsRuntimeStore((s) => s.neuralState);
  const lastEvent = useOsRuntimeStore((s) => s.lastEvent);
  const atmosphere = useOsRuntimeStore((s) => s.atmosphere);

  if (!mounted || reduceMotion) return null;

  const isEvent = lastEvent?.message === aiMessage;

  return (
    <div className="ai-assistant-layer pointer-events-none fixed z-[45]" aria-live="polite">
      <AnimatePresence mode="wait">
        {aiVisible && aiMessage && (
          <motion.aside
            key={aiMessage}
            className="ai-assistant-layer__card"
            initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 6, filter: "blur(4px)" }}
            transition={easeLuxury}
          >
            <span className="ai-assistant-layer__eyebrow">
              {isEvent ? "Infrastructure event" : "System observation"}
            </span>
            <p className="ai-assistant-layer__message">{aiMessage}</p>
            <span className="ai-assistant-layer__meta">
              Neural · {neuralState} · {atmosphere}
            </span>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}

export const AiAssistantLayer = memo(AiAssistantLayerInner);
