'use client'

import { motion } from 'framer-motion'

import { Container, PageShell, SectionHeader } from '@/components/layout/page-shell'
import { CompanyCard } from '@/components/cards/company-card'
import { companyService } from '@/services'
import { staggerContainer, staggerItem } from '@/animations/variants'

export default function EmpresasPage() {
  const companies = companyService.list()

  return (
    <PageShell>
      <Container className="py-6">
        <SectionHeader
          title="Empresas"
          subtitle="Conheça as empresas parceiras do CBX em Capão Bonito"
        />
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {companies.map((company) => (
            <motion.div key={company.id} variants={staggerItem} className="w-full">
              <CompanyCard company={company} className="w-full" />
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </PageShell>
  )
}
