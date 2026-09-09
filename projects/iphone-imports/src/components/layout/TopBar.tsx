import { storeConfig } from "@/config/store";

export function TopBar() {
  return (
    <div className="bg-brand-black text-white">
      <div className="overflow-hidden md:overflow-visible">
        <div className="flex whitespace-nowrap py-2 md:justify-center">
          <span className="marquee inline-block px-4 text-xs font-medium md:animate-none md:px-0">
            {storeConfig.topBarMessage}
          </span>
          <span className="marquee inline-block px-4 text-xs font-medium md:hidden">
            {storeConfig.topBarMessage}
          </span>
        </div>
      </div>
    </div>
  );
}
