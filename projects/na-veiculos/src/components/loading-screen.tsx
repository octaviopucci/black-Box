"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { site } from "@/data/site";
import { asset } from "@/lib/assets";

const STORAGE_KEY = "na-veiculos-loaded";
const RING = 2 * Math.PI * 54;

type Phase = "enter" | "load" | "exit";

export function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<Phase>("enter");

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) {
      setVisible(false);
      return;
    }

    document.body.classList.add("loading-active");

    const enterTimer = window.setTimeout(() => setPhase("load"), 180);
    const start = performance.now() + 180;
    let frame = 0;

    const tick = (now: number) => {
      const value = Math.min(Math.max((now - start) / 2400, 0), 1);
      setProgress(Math.round(value * 100));

      if (value < 1) {
        frame = requestAnimationFrame(tick);
        return;
      }

      setPhase("exit");
      window.setTimeout(() => {
        sessionStorage.setItem(STORAGE_KEY, "1");
        setVisible(false);
        document.body.classList.remove("loading-active");
      }, 650);
    };

    frame = requestAnimationFrame(tick);

    return () => {
      window.clearTimeout(enterTimer);
      cancelAnimationFrame(frame);
      document.body.classList.remove("loading-active");
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`loader-screen fixed inset-0 z-[100] flex items-center justify-center bg-black ${
        phase === "exit" ? "loader-exit" : phase === "enter" ? "loader-enter" : ""
      }`}
      aria-hidden={phase === "exit"}
      aria-live="polite"
      aria-busy={phase !== "exit"}
    >
      <div
        className={`loader-logo-wrap relative flex items-center justify-center overflow-visible ${
          phase === "enter" ? "opacity-0 scale-[0.92]" : "opacity-100 scale-100"
        } transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]`}
      >
        <svg
          className="absolute left-1/2 top-1/2 h-[9.5rem] w-[9.5rem] -translate-x-1/2 -translate-y-1/2 -rotate-90"
          viewBox="0 0 120 120"
          aria-hidden
        >
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
            strokeDasharray="3 5"
          />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="white"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeDasharray={RING}
            strokeDashoffset={RING - (progress / 100) * RING}
            className="transition-[stroke-dashoffset] duration-150 ease-out"
          />
        </svg>

        <Image
          src={asset(site.assets.logo)}
          alt={site.name}
          width={2400}
          height={767}
          priority
          className="relative z-10 h-auto w-[min(72vw,240px)] max-w-none object-contain brightness-0 invert"
        />
      </div>
    </div>
  );
}
