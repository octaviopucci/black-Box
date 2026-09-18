"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { PlatformShell } from "@/components/platform/platform-shell";
import { PlatformAuthProvider, usePlatformAuth } from "@/contexts/platform-auth-context";

const PUBLIC_PATHS = ["/platform/login"];

function PlatformGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, loading } = usePlatformAuth();

  useEffect(() => {
    if (PUBLIC_PATHS.includes(pathname)) return;
    if (!loading && !session) router.replace("/platform/login");
  }, [pathname, router, session, loading]);

  if (PUBLIC_PATHS.includes(pathname)) return children;
  if (loading || !session) return null;
  return <PlatformShell>{children}</PlatformShell>;
}

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return (
    <PlatformAuthProvider>
      <PlatformGate>{children}</PlatformGate>
    </PlatformAuthProvider>
  );
}
