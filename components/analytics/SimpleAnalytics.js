/* eslint-disable @next/next/no-img-element */
import Script from 'next/script'

const SimpleAnalyticsScript = () => {
  return (
    <>
      <Script strategy="lazyOnload">
        {`
            window.sa_event=window.sa_event||function(){var a=[].slice.call(arguments);window.sa_event.q?window.sa_event.q.push(a):window.sa_event.q=[a]};
        `}
      </Script>
      <Script strategy="lazyOnload" src="https://scripts.simpleanalyticscdn.com/latest.js" />
    </>
  )
}

export const logEvent = (eventName, ...rest) => {
  return window.sa_event?.(eventName, ...rest)
}

export default SimpleAnalyticsScript
