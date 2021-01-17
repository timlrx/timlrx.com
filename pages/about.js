import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'
import { PageSeo } from '@/components/SEO'

export default function About() {
  return (
    <>
      <PageSeo
        title={`About - ${siteMetadata.author}`}
        description={`About me - ${siteMetadata.author}`}
        url={`${siteMetadata.siteUrl}/about`}
      />
      <div className="divide-y">
        <div className="pt-6 pb-8 space-y-2 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            About
          </h1>
        </div>
        <div className="items-start space-y-2 xl:grid xl:grid-cols-3 xl:gap-x-8 xl:space-y-0">
          <div className="flex flex-col items-center pt-8 space-x-2">
            <img src={siteMetadata.image} alt="avatar" className="w-48 h-48 rounded-full" />
            <h3 className="pt-4 pb-2 text-2xl font-bold leading-8 tracking-tight">
              {siteMetadata.author}
            </h3>
            <div className="text-gray-500 dark:text-gray-400">Data Scientist</div>
            <div className="text-gray-500 dark:text-gray-400">Cylynx</div>
            <div className="flex pt-6 space-x-3">
              <SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} />
              <SocialIcon kind="github" href={siteMetadata.github} />
              <SocialIcon kind="linkedin" href={siteMetadata.linkedin} />
              <SocialIcon kind="twitter" href={siteMetadata.twitter} />
            </div>
          </div>
          <div className="pt-8 pb-8 prose dark:prose-dark max-w-none xl:col-span-2">
            <p>
              Welcome to Quasilinear Musings! I am Timothy, currently working as a data scientist at
              Lynx Analytics. For more information check out my{' '}
              <a href="https://www.linkedin.com/in/timlrx">Linkedin profile</a>.
            </p>
            <p>
              This blog serves as a playground for me to share some of my works in a more accessible
              manner and explore the use of data to communicate ideas. I code predominantly in R or
              Python. Check out my analysis on migration and food consumption which I have written
              up as part of my masters thesis <a href="/mig_cons_slides/">slides available here</a>{' '}
              or preview the <a href="/dashboard/">Singapore economy dashboard</a>. For a more
              technical read check out how to{' '}
              <a href="/2018/04/08/creating-a-custom-cross-validation-function-in-pyspark">
                create a custom cross-validation function in pyspark
              </a>{' '}
              or my thoughts on{' '}
              <a href="/2018/08/09/applications-of-dags-in-causal-inference">
                using DAGs in causal inference
              </a>
              .
            </p>
            <p>
              My current interests are in the areas of labour economics, technology change,
              econometrics, NLP and graph theory so expect to see more of these stuff in the future!
              This blog is written in R markdown using the excellent
              <a href="https://github.com/rstudio/blogdown">Blogdown</a> package that is a wrapper
              for Hugo (a static site generator). Source code for the website is available at my{' '}
              <a href="https://github.com/timlrx/website-hugo">Github page</a>.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
