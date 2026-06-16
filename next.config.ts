import type { NextConfig } from 'next'
const config: NextConfig = {
  images: { domains: ['i.ytimg.com','img.youtube.com'] },
  experimental: { serverComponentsExternalPackages: ['@prisma/client','bcryptjs'] },
}
export default config
