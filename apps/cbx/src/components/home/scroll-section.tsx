'use client'

import { motion } from 'framer-motion'
import { slideUp, staggerContainer, staggerItem } from '@/animations/variants'
import { cn } from '@/lib/utils'

export function ScrollSection({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.section
      variants={slideUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay }}
      className={cn('py-6 md:py-8', className)}
    >
      {children}
    </motion.section>
  )
}

export function StaggerGrid({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-20px' }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div variants={staggerItem} className={className}>
      {children}
    </motion.div>
  )
}

export function HorizontalScroll({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-20px' }}
      className={cn(
        '-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-none md:gap-4',
        className,
      )}
    >
      {children}
    </motion.div>
  )
}
