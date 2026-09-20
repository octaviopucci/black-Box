"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { useAuth } from "@/contexts/auth-context";
import { adminHomePath, isMerchantAdminOperational, resolvePlatformStatus } from "@/lib/platform-status";

const PUBLIC_PATHS = ["/admin/login", "/admin/signup"];
const PENDING_PATH = "/admin/pending";

function AdminGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, loading, refreshSession } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (PUBLIC_PATHS.includes(pathname)) return;
    if (!session) {
      router.replace("/admin/login");
      return;
    }

    const status = resolvePlatformStatus(session.establishment);
    if (!isMerchantAdminOperational(status) && pathname !== PENDING_PATH) {
      void refreshSession().then((fresh) => {
        const liveStatus = resolvePlatformStatus(
          fresh?.establishment ?? session.establishment,
        );
        if (isMerchantAdminOperational(liveStatus)) {
          router.replace("/admin");
          return;
        }
        router.replace(adminHomePath(fresh?.establishment ?? session.establishment));
      });
      return;
    }
    if (status === "active" && pathname === PENDING_PATH) {
      router.replace("/admin");
    }
    if (session.user.role === "WAITER" && !pathname.startsWith("/waiter")) {
      router.replace("/waiter");
    }
  }, [pathname, router, session, loading, refreshSession]);

  if (PUBLIC_PATHS.includes(pathname)) return children;
  if (loading || !session) return null;

  const status = resolvePlatformStatus(session.establishment);
  if (pathname === PENDING_PATH) return children;
  if (!isMerchantAdminOperational(status)) return null;

  return <AdminShell>{children}</AdminShell>;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminGate>{children}</AdminGate>;
}
