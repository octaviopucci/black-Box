'use client'

import { motion } from 'framer-motion'

import { Container, PageShell, SectionHeader } from '@/components/layout/page-shell'
import { StoreCard } from '@/components/cards/store-card'
import { storeService } from '@/services'
import { staggerContainer, staggerItem } from '@/animations/variants'

export default function LojasPage() {
  const stores = storeService.list()

  return (
    <PageShell>
      <Container className="py-6">
        <SectionHeader
          title="Lojas"
          subtitle={`${stores.length} lojas verificadas em Capão Bonito`}
        />
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {stores.map((store) => (
            <motion.div key={store.id} variants={staggerItem}>
              <StoreCard store={store} />
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </PageShell>
  )
}
