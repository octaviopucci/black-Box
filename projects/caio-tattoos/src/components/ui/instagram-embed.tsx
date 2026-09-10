type InstagramEmbedProps = {
  shortcode: string;
  kind: "p" | "reel";
  title: string;
};

export function InstagramEmbed({ shortcode, kind, title }: InstagramEmbedProps) {
  const path = kind === "reel" ? `reel/${shortcode}` : `p/${shortcode}`;

  return (
    <div className="mx-auto w-full max-w-[540px] overflow-hidden ring-1 ring-line/40 bg-black">
      <iframe
        src={`https://www.instagram.com/${path}/embed`}
        title={title}
        className="w-full border-0"
        style={{ minHeight: kind === "reel" ? 640 : 580 }}
        scrolling="no"
        allow="encrypted-media; clipboard-write"
        loading="lazy"
      />
    </div>
  );
}
