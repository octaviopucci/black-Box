"use client";

import { SignupForm } from "@/components/auth/signup-form";

export function SignupSection() {
  return (
    <section id="cadastro" className="mt-24 scroll-mt-8">
      <div className="mx-auto max-w-lg">
        <div className="glass-panel p-8 sm:p-10">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold">Crie sua conta</h2>
          <p className="mt-2 text-sm text-muted">
            Restaurante, lanchonete, padaria ou bar — configure em minutos.
          </p>
          <div className="mt-6">
            <SignupForm compact />
          </div>
        </div>
      </div>
    </section>
  );
}
