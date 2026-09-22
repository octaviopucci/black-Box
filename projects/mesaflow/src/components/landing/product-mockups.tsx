import Image from "next/image";
import { DesktopFrame, PhoneFrame } from "@/components/landing/device-frame";
import { asset } from "@/lib/assets";
import { cn } from "@/lib/cn";

type MockupSpec = {
  src: string;
  alt: string;
  frame: "phone" | "desktop";
  width: number;
  height: number;
};

const MOCKUP_ASSETS: Record<"guest" | "admin" | "kds" | "waiter" | "closing", MockupSpec> = {
  guest: {
    src: "/landing/mockups/guest-menu.png",
    alt: "Cardápio NA MESA no celular do cliente",
    frame: "phone",
    width: 390,
    height: 844,
  },
  admin: {
    src: "/landing/mockups/admin-orders.png",
    alt: "Painel de pedidos NA MESA",
    frame: "desktop",
    width: 1280,
    height: 800,
  },
  kds: {
    src: "/landing/mockups/kds-cozinha.png",
    alt: "KDS cozinha NA MESA",
    frame: "desktop",
    width: 1280,
    height: 800,
  },
  waiter: {
    src: "/landing/mockups/waiter-mesas.png",
    alt: "App garçom NA MESA",
    frame: "phone",
    width: 390,
    height: 844,
  },
  closing: {
    src: "/landing/mockups/closing-conta.png",
    alt: "Fechamento de conta NA MESA",
    frame: "phone",
    width: 390,
    height: 844,
  },
};

function ScreenshotInFrame({ spec, className }: { spec: MockupSpec; className?: string }) {
  const image = (
    <Image
      src={asset(spec.src)}
      alt={spec.alt}
      width={spec.width}
      height={spec.height}
      className="h-full w-full object-cover object-top"
      sizes={spec.frame === "phone" ? "280px" : "(min-width: 768px) 640px, 100vw"}
    />
  );

  if (spec.frame === "phone") {
    return <PhoneFrame className={className}>{image}</PhoneFrame>;
  }
  return <DesktopFrame className={className}>{image}</DesktopFrame>;
}

export function GuestMenuMockup({ className }: { className?: string }) {
  return <ScreenshotInFrame spec={MOCKUP_ASSETS.guest} className={className} />;
}

export function AdminOrdersMockup({ className }: { className?: string }) {
  return <ScreenshotInFrame spec={MOCKUP_ASSETS.admin} className={className} />;
}

export function KdsMockup({ className }: { className?: string }) {
  return <ScreenshotInFrame spec={MOCKUP_ASSETS.kds} className={className} />;
}

export function WaiterMockup({ className }: { className?: string }) {
  return <ScreenshotInFrame spec={MOCKUP_ASSETS.waiter} className={className} />;
}

export function ClosingMockup({ className }: { className?: string }) {
  return <ScreenshotInFrame spec={MOCKUP_ASSETS.closing} className={className} />;
}

type ProductMockupProps = {
  variant: keyof typeof MOCKUP_ASSETS;
  className?: string;
};

export function ProductMockup({ variant, className }: ProductMockupProps) {
  return <ScreenshotInFrame spec={MOCKUP_ASSETS[variant]} className={cn(className)} />;
}
