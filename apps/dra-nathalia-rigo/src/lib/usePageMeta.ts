import { useEffect } from 'react'
import { brand } from '@/data/site'

export function usePageMeta(title: string, description: string) {
  useEffect(() => {
    document.title = title
    const node =
      document.querySelector('meta[name="description"]') ??
      (() => {
        const meta = document.createElement('meta')
        meta.setAttribute('name', 'description')
        document.head.appendChild(meta)
        return meta
      })()
    node.setAttribute('content', description)
    return () => {
      document.title = `${brand.name} · Estética Avançada · Sorocaba`
    }
  }, [title, description])
}
