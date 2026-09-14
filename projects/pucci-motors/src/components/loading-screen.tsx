"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { site } from "@/data/site";
import { asset } from "@/lib/assets";

const STORAGE_KEY = "na-veiculos-loaded";

type Phase = "enter" | "shine" | "exit" | "done";

export function LoadingScreen() {
  const [phase, setPhase] = useState<Phase>("enter");

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) {
      setPhase("done");
      return;
    }

    document.body.classList.add("loading-active");

    const shineTimer = window.setTimeout(() => setPhase("shine"), 120);
    const exitTimer = window.setTimeout(() => setPhase("exit"), 2400);
    const doneTimer = window.setTimeout(() => {
      sessionStorage.setItem(STORAGE_KEY, "1");
      setPhase("done");
      document.body.classList.remove("loading-active");
    }, 3100);

    return () => {
      window.clearTimeout(shineTimer);
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
      document.body.classList.remove("loading-active");
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className={`loader-splash fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-black ${
        phase === "exit" ? "loader-splash--exit" : ""
      }`}
      aria-hidden={phase === "exit"}
      aria-live="polite"
      aria-busy={phase !== "exit"}
      aria-label="Carregando"
    >
      <div
        className={`loader-splash__logo ${phase === "enter" ? "loader-splash__logo--enter" : "loader-splash__logo--ready"}`}
      >
        <Image
          src={asset(site.assets.logo)}
          alt={site.name}
          width={2400}
          height={767}
          priority
          className="loader-splash__image h-auto w-[min(78vw,280px)] object-contain"
        />
        {(phase === "shine" || phase === "exit") && (
          <span className="loader-splash__shine" aria-hidden />
        )}
      </div>

      <p
        className={`loader-splash__city font-mono text-[10px] uppercase tracking-[0.42em] text-white/40 ${
          phase === "enter" ? "opacity-0" : "loader-splash__city--in"
        }`}
      >
        {site.city}
      </p>
    </div>
  );
}
