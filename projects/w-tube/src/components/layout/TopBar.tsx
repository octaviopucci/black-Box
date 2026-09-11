import { storeConfig } from "@/config/store";

export function TopBar() {
  return (
    <div className="border-b border-white/10 brand-header-bg text-white">
      <div className="overflow-hidden md:overflow-visible">
        <div className="flex whitespace-nowrap py-2 md:justify-center">
          <p className="marquee px-4 text-xs font-bold uppercase tracking-wider md:animate-none md:px-0">
            {storeConfig.topBarMessage}
          </p>
          <p className="marquee px-4 text-xs font-bold uppercase tracking-wider md:hidden">
            {storeConfig.topBarMessage}
          </p>
        </div>
      </div>
    </div>
  );
}
