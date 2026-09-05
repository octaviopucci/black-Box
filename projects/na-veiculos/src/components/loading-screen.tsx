"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { site } from "@/data/site";
import { asset } from "@/lib/assets";

type Phase = "loading" | "exit" | "done";

export function LoadingScreen() {
  const [phase, setPhase] = useState<Phase>("loading");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setPhase("done");
      return;
    }

    document.body.classList.add("loading-active");

    const revealTimer = window.setTimeout(() => setPhase("exit"), 1300);
    return () => window.clearTimeout(revealTimer);
  }, []);

  useEffect(() => {
    if (phase !== "exit") return;

    const exitTimer = window.setTimeout(() => {
      setPhase("done");
      document.body.classList.remove("loading-active");
    }, 650);

    return () => window.clearTimeout(exitTimer);
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div
      className={`loading-screen ${phase === "exit" ? "loading-screen--exit" : ""}`}
      aria-hidden={phase === "exit"}
      aria-live="polite"
      aria-label="Carregando"
    >
      <div className="loading-screen__logo-wrap">
        <Image
          src={asset(site.assets.logo)}
          alt={site.name}
          width={220}
          height={72}
          priority
          className="loading-screen__logo h-auto w-[min(58vw,220px)]"
        />
        <span className="loading-screen__shine" aria-hidden />
      </div>
      <p className="loading-screen__city font-mono text-[10px] uppercase tracking-[0.4em] text-mute">
        {site.city}
      </p>
    </div>
  );
}
