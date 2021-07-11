// import siteMetadata from '@/data/siteMetadata'
// import SocialIcon from '@/components/social-icons'
// import Link from '@/components/Link'
// import { PageSeo } from '@/components/SEO'

// export default function About() {
//   return (
//     <>
//       <PageSeo
//         title={`About - ${siteMetadata.author}`}
//         description={`About me - ${siteMetadata.author}`}
//         url={`${siteMetadata.siteUrl}/about`}
//       />
//       <div className="divide-y">
//         <div className="pt-6 pb-8 space-y-2 md:space-y-5">
//           <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
//             About
//           </h1>
//         </div>
//         <div className="items-start space-y-2 xl:grid xl:grid-cols-3 xl:gap-x-8 xl:space-y-0">
//           <div className="flex flex-col items-center pt-8 space-x-2">
//             <img src={siteMetadata.image} alt="avatar" className="w-48 h-48 rounded-full" />
//             <h3 className="pt-4 pb-2 text-2xl font-bold leading-8 tracking-tight">
//               {siteMetadata.author}
//             </h3>
//             <div className="text-gray-500 dark:text-gray-400">
//               Data Scientist, Developer, Economist
//             </div>

//             <div className="text-gray-500 dark:text-gray-400">
//               <Link href="https://www.cylynx.io">Co-founder at Cylynx</Link>
//             </div>
//             <div className="flex pt-6 space-x-3">
//               <SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} />
//               <SocialIcon kind="github" href={siteMetadata.github} />
//               <SocialIcon kind="linkedin" href={siteMetadata.linkedin} />
//               <SocialIcon kind="twitter" href={siteMetadata.twitter} />
//             </div>
//           </div>
//           <div className="pt-8 pb-8 prose dark:prose-dark max-w-none xl:col-span-2">
//             <p>
//               Welcome to Quasilinear Musings! This blog serves as a playground for me to experiment
//               with ideas and share some of my findings. It's a reflection of my career path and
//               interests - especially on the technical side of things. For more information, check
//               out my <Link href="https://www.linkedin.com/in/timlrx">Linkedin profile</Link>.
//             </p>
//             <p>
//               I am proficient in R, Python and Javascript. My current interests are in the areas of
//               network analytics, full-stack development, technology and labour economics so expect
//               to see more of these stuff in the future! This blog is bootstrapped from the awesome{' '}
//               <Link href="https://github.com/timlrx/tailwind-nextjs-starter-blog">
//                 Tailwind Nextjs Starter Blog Template
//               </Link>{' '}
//               (coincidentally written by me). Source code for the website is available at my{' '}
//               <Link href="https://github.com/timlrx/timlrx.com">Github page</Link>.
//             </p>
//             <p>
//               Highlights - check out my analysis on migration and food consumption which I have
//               written up as part of my masters thesis{' '}
//               <Link href="/static/mig_cons_slides/index.html">slides available here</Link> or
//               preview the{' '}
//               <Link href="/dashboard/sg-dashboard.html">Singapore economy dashboard</Link>. For a
//               more technical read check out how to{' '}
//               <Link href="/blog/creating-a-custom-cross-validation-function-in-pyspark">
//                 create a custom cross-validation function in pyspark
//               </Link>{' '}
//               or my thoughts on{' '}
//               <Link href="/blog/applications-of-dags-in-causal-inference">
//                 using DAGs in causal inference
//               </Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     </>
import { MDXLayoutRenderer } from '@/components/MDXComponents'
import { getFileBySlug } from '@/lib/mdx'

const DEFAULT_LAYOUT = 'AuthorLayout'

export async function getStaticProps() {
  const authorDetails = await getFileBySlug('authors', ['default'])
  return { props: { authorDetails } }
}

export default function About({ authorDetails }) {
  const { mdxSource, frontMatter } = authorDetails

  return (
    <MDXLayoutRenderer
      layout={frontMatter.layout || DEFAULT_LAYOUT}
      mdxSource={mdxSource}
      frontMatter={frontMatter}
    />
  )
}
