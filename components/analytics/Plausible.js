import Script from 'next/script'

export const PLAUSIBLE_DATA_DOMAIN = 'timlrx.com'

const PlausibleScript = () => {
  return (
    <Script
      strategy="lazyOnload"
      data-domain={PLAUSIBLE_DATA_DOMAIN}
      src="https://plausible.io/js/plausible.js"
    />
  )
}

export default PlausibleScript
