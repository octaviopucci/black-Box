import { About } from '@/components/About'
import { AreasOfActuation } from '@/components/AreasOfActuation'
import { Contact, SocialLinks } from '@/components/Contact'
import { ContentGrid } from '@/components/ContentGrid'
import { Featured } from '@/components/Featured'
import { Gallery } from '@/components/Gallery'
import { Hero } from '@/components/Hero'
import { InstagramFeed } from '@/components/InstagramFeed'
import { MapSection } from '@/components/MapSection'
import { Numbers } from '@/components/Numbers'
import { Projects } from '@/components/Projects'
import { Timeline } from '@/components/Timeline'
import { VideoSection } from '@/components/VideoSection'

export function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Timeline />
      <AreasOfActuation />
      <Projects />
      <Numbers />
      <MapSection />
      <InstagramFeed />
      <ContentGrid />
      <VideoSection />
      <Featured />
      <Gallery />
      <Contact />
      <SocialLinks />
    </>
  )
}
