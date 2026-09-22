import { cn } from "@/lib/cn";

type PhoneFrameProps = {
  children: React.ReactNode;
  className?: string;
  label?: string;
};

export function PhoneFrame({ children, className, label }: PhoneFrameProps) {
  return (
    <div className={cn("mx-auto w-full max-w-[280px]", className)}>
      <div className="relative rounded-[2rem] border border-[#333] bg-[#0a0a0a] p-2 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.8)]">
        <div className="absolute left-1/2 top-2.5 h-1 w-16 -translate-x-1/2 rounded-full bg-[#222]" aria-hidden />
        <div className="overflow-hidden rounded-[1.5rem] bg-[#1a1a1a]">{children}</div>
      </div>
      {label ? <p className="mt-2 text-center text-xs text-muted">{label}</p> : null}
    </div>
  );
}

type DesktopFrameProps = {
  children: React.ReactNode;
  className?: string;
  label?: string;
};

export function DesktopFrame({ children, className, label }: DesktopFrameProps) {
  return (
    <div className={cn("mx-auto w-full", className)}>
      <div className="overflow-hidden rounded-t-xl border border-b-0 border-[#333] bg-[#0a0a0a] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.8)]">
        <div className="flex items-center gap-1.5 border-b border-[#222] px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-2 text-[10px] text-muted">NA MESA · Operação</span>
        </div>
        <div className="aspect-[16/10] overflow-hidden bg-[#111]">{children}</div>
      </div>
      <div className="mx-auto h-3 w-[85%] rounded-b-lg bg-[#222]" />
      {label ? <p className="mt-2 text-center text-xs text-muted">{label}</p> : null}
    </div>
  );
}
