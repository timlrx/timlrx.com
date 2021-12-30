const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

// You might need to insert additional domains in script-src if you are using external services
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' www.googletagmanager.com www.google-analytics.com;
  style-src 'self' 'unsafe-inline' *.googleapis.com cdn.jsdelivr.net;
  frame-src youtube.com www.youtube.com;
  img-src * blob: data:;
  media-src 'none';
  connect-src *;
  font-src 'self' fonts.gstatic.com cdn.jsdelivr.net
`

const securityHeaders = [
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\n/g, ''),
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
]

module.exports = withBundleAnalyzer({
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'md', 'mdx'],
  eslint: {
    dirs: ['pages', 'components', 'lib', 'layouts', 'scripts'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
  webpack: (config, { dev, isServer }) => {
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|mp4)$/i,
      use: [
        {
          loader: 'file-loader',
          options: {
            publicPath: '/_next',
            name: 'static/media/[name].[hash].[ext]',
          },
        },
      ],
    })

    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    if (!dev && !isServer) {
      // Replace React with Preact only in client production build
      Object.assign(config.resolve.alias, {
        'react/jsx-runtime.js': 'preact/compat/jsx-runtime',
        react: 'preact/compat',
        'react-dom/test-utils': 'preact/test-utils',
        'react-dom': 'preact/compat',
      })
    }

    return config
  },
  async redirects() {
    return [
      {
        source: '/:path/index.xml',
        destination: '/:path/feed.xml',
        permanent: true,
      },
      {
        source: '/2020/08/01/schelling-segregation-model-in-julia-part-1',
        destination: '/blog/schelling-segregation-model-in-julia',
        permanent: true,
      },
      {
        source: '/2020/05/10/benchmark-of-popular-graph-network-packages-v2',
        destination: '/blog/benchmark-of-popular-graph-network-packages-v2',
        permanent: true,
      },
      {
        source: '/2020/03/29/efficient-large-graph-propagation-algorithm',
        destination: '/blog/efficient-large-graph-propagation-algorithm',
        permanent: true,
      },
      {
        source: '/2020/01/22/serverless-machine-learning-with-r-on-cloud-run',
        destination: '/blog/serverless-machine-learning-with-r-on-cloud-run',
        permanent: true,
      },
      {
        source: '/2019/12/17/speeding-up-r-plotly-webapps-r-x-javascript-part-i',
        destination: '/blog/speeding-up-r-plotly-webapps-r-x-javascript',
        permanent: true,
      },
      {
        source: '/2019/05/05/benchmark-of-popular-graph-network-packages',
        destination: '/blog/benchmark-of-popular-graph-network-packages',
        permanent: true,
      },
      {
        source: '/2019/02/11/binance-hackathon-2nd-place',
        destination: '/blog/binance-hackathon-2nd-place',
        permanent: true,
      },
      {
        source: '/2019/01/05/cleaning-openstreetmap-intersections-in-python',
        destination: '/blog/cleaning-openstreetmap-intersections-in-python',
        permanent: true,
      },
      {
        source: '/2018/11/21/an-overview-of-the-singapore-hiring-landscape',
        destination: '/blog/an-overview-of-the-singapore-hiring-landscape',
        permanent: true,
      },
      {
        source: '/2018/10/14/visualising-networks-in-asoiaf-part-ii',
        destination: '/blog/visualising-networks-in-asoiaf-part-ii',
        permanent: true,
      },
      {
        source: '/2018/09/09/visualising-networks-in-asoiaf',
        destination: '/blog/visualising-networks-in-asoiaf',
        permanent: true,
      },
      {
        source: '/2018/08/09/applications-of-dags-in-causal-inference',
        destination: '/blog/applications-of-dags-in-causal-inference',
        permanent: true,
      },
      {
        source:
          '/2018/06/19/feature-selection-using-feature-importance-score-creating-a-pyspark-estimator',
        destination:
          '/blog/feature-selection-using-feature-importance-score-creating-a-pyspark-estimator',
        permanent: true,
      },
      {
        source: '/2018/04/28/statistical-musings',
        destination: '/blog/statistical-musings',
        permanent: true,
      },
      {
        source: '/2018/04/08/creating-a-custom-cross-validation-function-in-pyspark',
        destination: '/blog/creating-a-custom-cross-validation-function-in-pyspark',
        permanent: true,
      },
      {
        source: '/2018/04/08/creating-a-custom-cross-validation-function-in-pyspark',
        destination:
          '/blog/notes-on-regression-approximation-of-the-conditional-expectation-function',
        permanent: true,
      },
      {
        source: '/2018/03/25/uploading-jupyter-notebook-files-to-blogdown',
        destination: '/blog/uploading-jupyter-notebook-files-to-blogdown',
        permanent: true,
      },
      {
        source:
          '/2018/02/26/notes-on-regression-approximation-of-the-conditional-expectation-function',
        destination:
          '/blog/notes-on-regression-approximation-of-the-conditional-expectation-function',
        permanent: true,
      },
      {
        source: '/2018/02/11/february-thoughts',
        destination: '/blog/february-thoughts',
        permanent: true,
      },
      {
        source: '/2017/12/25/notes-on-graphs-and-spectral-properties',
        destination: '/blog/notes-on-graphs-and-spectral-properties',
        permanent: true,
      },
      {
        source: '/2017/11/23/dashboard-2-0',
        destination: '/blog/dashboard-2-0',
        permanent: true,
      },
      {
        source: '/2017/11/18/choosing-a-control-group-in-a-rct-with-multiple-treatment-periods',
        destination: '/blog/choosing-a-control-group-in-a-rct-with-multiple-treatment-periods',
        permanent: true,
      },
      {
        source: '/2017/11/05/november-reflections',
        destination: '/blog/november-reflections',
        permanent: true,
      },
      {
        source: '/2017/10/21/notes-on-regression-singular-vector-decomposition',
        destination: '/blog/notes-on-regression-singular-vector-decomposition',
        permanent: true,
      },
      {
        source: '/2017/10/11/mapping-sg-shiny-app',
        destination: '/blog/mapping-sg-shiny-app',
        permanent: true,
      },
      {
        source: '/2017/10/01/comparing-the-population-and-group-level-regression',
        destination: '/blog/comparing-the-population-and-group-level-regression',
        permanent: true,
      },
      {
        source: '/2017/09/21/notes-on-regression-maximum-likelihood',
        destination: '/blog/comparing-the-population-and-group-level-regression',
        permanent: true,
      },
      {
        source: '/2017/09/13/using-leaflet-in-r-tutorial',
        destination: '/blog/using-leaflet-in-r-tutorial',
        permanent: true,
      },
      {
        source: '/2017/09/10/examining-the-changes-in-religious-beliefs-part-2',
        destination: '/blog/examining-the-changes-in-religious-beliefs-part-2',
        permanent: true,
      },
      {
        source: '/2017/08/31/notes-on-regression-method-of-moments',
        destination: '/blog/notes-on-regression-method-of-moments',
        permanent: true,
      },
      {
        source: '/2017/08/29/mapping-the-distribution-of-religious-beliefs-in-singapore',
        destination: '/blog/mapping-the-distribution-of-religious-beliefs-in-singapore',
        permanent: true,
      },
      {
        source: '/2017/08/23/notes-on-regression-projection',
        destination: '/blog/notes-on-regression-geometry',
        permanent: true,
      },
      {
        source: '/2017/08/17/thesis-thursday-7-conclusion',
        destination: '/blog/thesis-thursday-7-conclusion',
        permanent: true,
      },
      {
        source: '/2017/08/16/notes-on-regression-ols',
        destination: '/blog/notes-on-regression-ols',
        permanent: true,
      },
      {
        source: '/2017/08/15/update-on-the-sg-economic-dashboard',
        destination: '/blog/update-on-the-sg-economic-dashboard',
        permanent: true,
      },
      {
        source: '/2017/07/20/thesis-thursday-6-the-final-stretch',
        destination: '/blog/thesis-thursday-6-the-final-stretch',
        permanent: true,
      },
      {
        source: '/2017/07/01/thesis-thursday-5-from-recipes-to-weights',
        destination: '/blog/thesis-thursday-5-from-recipes-to-weights',
        permanent: true,
      },
      {
        source: '/2017/06/24/thesis-thursday-4-analysing-recipes',
        destination: '/blog/thesis-thursday-4-analysing-recipes',
        permanent: true,
      },
      {
        source: '/2017/06/23/thesis-thursday-3-model-and-methodology',
        destination: '/blog/thesis-thursday-3-model-and-methodology',
        permanent: true,
      },
      {
        source: '/2017/06/11/binscatter-for-r',
        destination: '/blog/binscatter-for-r',
        permanent: true,
      },
      {
        source: '/2017/06/09/thesis-thursday-2',
        destination: '/blog/thesis-thursday-2',
        permanent: true,
      },
      {
        source: '/2017/06/02/thesis-thursday-introduction',
        destination: '/blog/thesis-thursday-introduction',
        permanent: true,
      },
      {
        source: '/2017/06/02/thesis-thursday-introduction',
        destination: '/blog/thesis-thursday-introduction',
        permanent: true,
      },
      {
        source: '/2017/05/15/hello-world',
        destination: '/blog/hello-world',
        permanent: true,
      },
    ]
  },
})
