import '@/css/tailwind.css'

import { ThemeProvider } from 'next-themes'
import Head from 'next/head'

import LayoutWrapper from '@/components/LayoutWrapper'
import GAScript from '@/components/analytics/GoogleAnalytics'
import Plausible from '@/components/analytics/Plausible'
import SimpleAnalytics from '@/components/analytics/SimpleAnalytics'

const isProduction = process.env.NODE_ENV === 'production'

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class">
      <Head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      {isProduction && <GAScript />}
      {isProduction && <Plausible />}
      {isProduction && <SimpleAnalytics />}
      <LayoutWrapper>
        <Component {...pageProps} />
      </LayoutWrapper>
    </ThemeProvider>
  )
}
