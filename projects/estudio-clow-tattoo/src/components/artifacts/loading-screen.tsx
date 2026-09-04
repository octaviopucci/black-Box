"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { site } from "@/data/site";

const STORAGE_KEY = "clow-loaded";

export function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) {
      setVisible(false);
      return;
    }

    const start = performance.now();
    const duration = 2200;

    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setProgress(Math.round(p * 100));
      if (p < 1) {
        requestAnimationFrame(tick);
      } else {
        setExiting(true);
        setTimeout(() => {
          sessionStorage.setItem(STORAGE_KEY, "1");
          setVisible(false);
        }, 500);
      }
    };

    requestAnimationFrame(tick);
  }, []);

  if (!visible) return null;

  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black transition-opacity duration-500 ${
        exiting ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      aria-hidden={exiting}
    >
      <div className="relative flex h-36 w-36 items-center justify-center">
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 120 120" aria-hidden>
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
            strokeDasharray="4 6"
          />
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset] duration-100"
          />
        </svg>

        <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-[#111] ring-1 ring-white/10">
          <Image
            src={site.assets.logo}
            alt=""
            width={56}
            height={56}
            priority
            className="h-10 w-auto brightness-0 invert"
          />
        </div>
      </div>
    </div>
  );
}
