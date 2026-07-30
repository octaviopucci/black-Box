import { asset } from '../data/site'

type Props = {
  className?: string
  alt?: string
}

/** Real Clínica Matsubara logo mark from Instagram profile */
export function LogoImage({ className = 'h-9 w-9', alt = 'Clínica Matsubara' }: Props) {
  return (
    <img
      src={asset('brand/logo.jpg')}
      alt={alt}
      className={`${className} rounded-full object-cover ring-1 ring-wine/20`}
      width={72}
      height={72}
      decoding="async"
    />
  )
}
