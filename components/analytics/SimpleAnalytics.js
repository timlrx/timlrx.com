/* eslint-disable @next/next/no-img-element */
import Script from 'next/script'

const SimpleAnalyticsScript = () => {
  return (
    <>
      <Script strategy="lazyOnload" src="https://scripts.simpleanalyticscdn.com/latest.js" />
      <noscript>
        <img
          src="https://queue.simpleanalyticscdn.com/noscript.gif"
          alt=""
          referrerpolicy="no-referrer-when-downgrade"
        />
      </noscript>
    </>
  )
}

export default SimpleAnalyticsScript
