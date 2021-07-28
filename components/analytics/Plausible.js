import Script from 'next/script'

import siteMetadata from '@/data/siteMetadata'

const PlausibleScript = () => {
  return (
    <>
      <Script
        strategy="lazyOnload"
        data-domain={siteMetadata.analytics.plausibleDataDomain}
        src="https://plausible.io/js/plausible.js"
      />
      <Script strategy="lazyOnload">
        {`
            window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }
        `}
      </Script>
    </>
  )
}

export default PlausibleScript

export const logEvent = (eventName, ...rest) => {
  return window.plausible?.(eventName, ...rest)
}
