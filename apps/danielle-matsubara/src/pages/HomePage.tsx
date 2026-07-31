import { Shell } from '../components/Shell'
import { Hero } from '../components/Hero'
import { Presence } from '../components/Presence'
import { Doorway } from '../components/Doorway'
import { CraftTeaser } from '../components/CraftTeaser'
import { Invitation } from '../components/Invitation'
import { usePageMeta } from '../hooks/usePageMeta'
import { site } from '../data/site'

export function HomePage() {
  usePageMeta(site.seo.home.title, site.seo.home.description)

  return (
    <Shell>
      <Hero />
      <Presence />
      <Doorway />
      <CraftTeaser />
      <Invitation />
    </Shell>
  )
}
