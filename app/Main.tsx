import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import NewsletterForm from 'pliny/ui/NewsletterForm'
import { ArrowRight } from 'lucide-react'

const MAX_DISPLAY = 5

export default function Home({ posts }) {
  return (
    <>
      <div className="my-6 flex flex-col gap-x-12 lg:mb-12 lg:flex-row">
        <div className="space-y-8 pt-16">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 sm:text-4xl">
              Timothy Lin
            </h1>
            <p className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Data scientist, economist, and software engineer
            </p>
          </div>

          <div className="space-y-6">
            <p className="max-w-xl text-gray-600 dark:text-gray-400">
              {siteMetadata.description}. I am the co-founder of Cylynx, combining data science with
              economic insights to build better solutions.
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <h2 className="font-mono text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Latest Writing
          </h2>
        </div>

        <ul className="divide-y divide-gray-200 pr-8 dark:divide-gray-700">
          {!posts.length && (
            <li className="py-4">
              <p className="text-gray-600 dark:text-gray-400">No posts found.</p>
            </li>
          )}

          {posts.slice(0, MAX_DISPLAY).map((post) => {
            const { slug, date, title, summary, tags } = post
            return (
              <li key={slug} className="py-12">
                <article>
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <div className="flex flex-col gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                          <Link href={`/blog/${slug}`}>{title}</Link>
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {tags.map((tag) => (
                            <Tag key={tag} text={tag} />
                          ))}
                        </div>
                      </div>

                      <p className="max-w-4xl text-gray-600 dark:text-gray-400">{summary}</p>
                    </div>

                    <Link
                      href={`/blog/${slug}`}
                      className="group inline-flex items-center text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                      aria-label={`Read "${title}"`}
                    >
                      Read article
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </div>

      {posts.length > MAX_DISPLAY && (
        <div className="flex justify-end py-12">
          <Link
            href="/blog"
            className="group inline-flex items-center text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            View archive
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      )}

      <div className="py-16">
        <div className="mx-auto w-[290px] lg:w-[400px]">
          <h2 className="mb-8 font-mono text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Newsletter
          </h2>
          <NewsletterForm title="Stay updated, receive the latest post straight to your mailbox" />
        </div>
      </div>
    </>
  )
}
