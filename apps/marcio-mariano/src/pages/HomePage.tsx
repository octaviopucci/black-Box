import { SiteShell } from '../components/SiteShell'
import { Hero } from '../components/Hero'
import { PropertySearch } from '../components/PropertySearch'
import {
  FeaturedStrip,
  LegacyTeaser,
  OwnerCta,
  RegionsMarquee,
  ServicesPreview,
  SplitInventory,
  TrustBand,
} from '../components/HomeSections'

export function HomePage() {
  return (
    <SiteShell>
      <Hero />
      <PropertySearch mode="home" />
      <FeaturedStrip />
      <TrustBand />
      <RegionsMarquee />
      <SplitInventory />
      <ServicesPreview />
      <LegacyTeaser />
      <OwnerCta />
    </SiteShell>
  )
}
