"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { useAuth } from "@/contexts/auth-context";

const PUBLIC_PATHS = ["/admin/login", "/admin/signup"];

function AdminGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, loading } = useAuth();

  useEffect(() => {
    if (PUBLIC_PATHS.includes(pathname)) return;
    if (!loading && !session) router.replace("/admin/login");
  }, [pathname, router, session, loading]);

  if (PUBLIC_PATHS.includes(pathname)) return children;
  if (loading || !session) return null;
  return <AdminShell>{children}</AdminShell>;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminGate>{children}</AdminGate>;
}
