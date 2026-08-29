import { Play } from 'lucide-react'
import { videos } from '@/data/videos'
import { Reveal } from './Reveal'

export function VideoSection() {
  return (
    <section id="videos" className="bg-[#f6faf8] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-green">Vídeos</p>
          <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] font-black leading-tight text-green-deep">
            Em vídeo
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {videos.map((video, i) => (
            <Reveal key={video.id} delay={i * 0.05}>
              <a
                href={video.url.startsWith('http') ? video.url : '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block overflow-hidden rounded-sm"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-green-deep/30 transition-colors group-hover:bg-green-deep/45">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow text-green-dark shadow-lg">
                    <Play size={24} fill="currentColor" aria-hidden />
                  </span>
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-green-deep/90 to-transparent p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-yellow">{video.category}</p>
                  <h3 className="mt-1 font-display text-lg font-bold text-white">{video.title}</h3>
                  <p className="mt-1 text-xs text-white/60">{video.date}</p>
                </div>
                {video.isPlaceholder && (
                  <span className="absolute left-3 top-3 rounded-sm bg-graphite/80 px-2 py-1 text-[0.65rem] font-bold uppercase text-white">
                    Placeholder
                  </span>
                )}
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
