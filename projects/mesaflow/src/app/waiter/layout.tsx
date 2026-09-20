"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "@/contexts/auth-context";
import { WaiterShell } from "@/components/waiter/waiter-shell";

function WaiterGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, loading } = useAuth();
  const publicPaths = ["/waiter/login", "/waiter/activate"];
  const isPublic = publicPaths.some((p) => pathname.startsWith(p));

  useEffect(() => {
    if (loading) return;
    if (!session && !isPublic) {
      router.replace("/waiter/login");
      return;
    }
    if (session && session.user.role !== "WAITER" && !isPublic) {
      router.replace("/admin");
      return;
    }
    if (session?.user.role === "WAITER" && pathname === "/waiter/login") {
      router.replace("/waiter");
    }
  }, [session, loading, isPublic, pathname, router]);

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background text-muted">
        Carregando…
      </div>
    );
  }

  if (isPublic) return <>{children}</>;
  if (!session || session.user.role !== "WAITER") return null;

  return <WaiterShell>{children}</WaiterShell>;
}

export default function WaiterLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <WaiterGate>{children}</WaiterGate>
    </AuthProvider>
  );
}
