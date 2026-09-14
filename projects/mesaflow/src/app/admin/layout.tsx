"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setOk(true);
      return;
    }
    const session = sessionStorage.getItem("mesaflow_admin");
    if (!session) router.replace("/admin/login");
    else setOk(true);
  }, [pathname, router]);

  if (!ok) return null;
  if (pathname === "/admin/login") return children;
  return <AdminShell>{children}</AdminShell>;
}
