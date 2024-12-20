import { Providers } from '@/app/providers'
import { Layout } from '@/components/Layout'

import '@/css/tailwind.css'

export const metadata = {
  title: {
    template: '%s - Josh Kahn',
    default:
      'Josh Kahn - Solutions architect, speaker, technology guy, dad',
  },
  description:
    "I'm Josh, a technology guy based in Chicago, IL.",
  alternates: {
    types: {
      'application/rss+xml': `${process.env.PUBLIC_SITE_URL}/feed.xml`,
    },
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script src="https://beamanalytics.io/beam.min.js"
          data-token="bc31214f-5579-438d-b781-416b8f686177"
          async
        >
        </script>
      </head>
      <body className="flex h-full bg-zinc-50 dark:bg-black">
        <Providers>
          <div className="flex w-full">
            <Layout>{children}</Layout>
          </div>
        </Providers>
      </body>
    </html>
  )
}
