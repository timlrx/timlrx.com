'use client'

import { usePathname } from 'next/navigation'
import { slug } from 'github-slugger'
import { formatDate } from 'pliny/utils/formatDate'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import tagData from 'app/tag-data.json'

interface PaginationProps {
  totalPages: number
  currentPage: number
}

interface ListLayoutProps {
  posts: CoreContent<Blog>[]
  title: string
  initialDisplayPosts?: CoreContent<Blog>[]
  pagination?: PaginationProps
}

function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname()
  const basePath = pathname.split('/')[1]
  const prevPage = currentPage - 1 > 0
  const nextPage = currentPage + 1 <= totalPages

  return (
    <nav className="flex items-center justify-between py-8">
      {!prevPage && (
        <button className="text-sm text-gray-400 dark:text-gray-400" disabled={!prevPage}>
          <span className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </span>
        </button>
      )}
      {prevPage && (
        <Link
          href={currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${currentPage - 1}`}
          rel="prev"
          className="group flex items-center text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Previous
        </Link>
      )}
      <span className="text-sm text-gray-500 dark:text-gray-300">
        Page {currentPage} of {totalPages}
      </span>
      {!nextPage && (
        <button className="text-sm text-gray-400 dark:text-gray-400" disabled={!nextPage}>
          <span className="flex items-center">
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </span>
        </button>
      )}
      {nextPage && (
        <Link
          href={`/${basePath}/page/${currentPage + 1}`}
          rel="next"
          className="group flex items-center text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
        >
          Next
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </nav>
  )
}

export default function ListLayoutWithTags({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const pathname = usePathname()
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])

  const displayPosts = initialDisplayPosts.length > 0 ? initialDisplayPosts : posts

  return (
    <>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 xl:px-0">
        <div className="space-y-8 pt-16 pb-12">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl dark:text-gray-100">
              {title}
            </h1>
          </div>

          <div className="flex flex-col gap-8 md:flex-row">
            {/* Tags Sidebar */}
            <aside className="hidden md:block md:w-64">
              <div className="sticky top-24 space-y-8">
                <div className="space-y-4">
                  <h2 className="font-mono text-sm tracking-wider text-gray-500 uppercase dark:text-gray-300">
                    Filter by tag
                  </h2>
                  <nav className="flex flex-col space-y-3">
                    {sortedTags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/tags/${slug(tag)}`}
                        className={`font-mono text-sm uppercase ${
                          pathname === `/tags/${slug(tag)}`
                            ? 'text-primary-600 dark:text-primary-400 font-extrabold'
                            : 'hover:text-primary-600 dark:hover:text-primary-400 text-gray-600 dark:text-gray-300'
                        }`}
                        aria-label={`View posts tagged ${tag}`}
                      >
                        {tag}
                        <span className="ml-2 text-gray-400 dark:text-gray-400">
                          ({tagCounts[tag]})
                        </span>
                      </Link>
                    ))}
                  </nav>
                </div>
              </div>
            </aside>

            {/* Posts List */}
            <div className="min-w-0 flex-1">
              <ul className="divide-y divide-gray-200 dark:divide-gray-800">
                {!displayPosts.length && (
                  <li className="py-4">
                    <p className="text-gray-600 dark:text-gray-300">No posts found.</p>
                  </li>
                )}

                {displayPosts.map((post) => {
                  const { path, date, title, summary, tags } = post
                  return (
                    <li key={path} className="py-12 first:pt-0">
                      <article>
                        <div className="space-y-8">
                          <div className="space-y-4">
                            <div className="flex flex-col gap-4 text-sm text-gray-500 dark:text-gray-300">
                              <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                <Link href={`/${path}`}>{title}</Link>
                              </h2>
                              <div className="flex flex-wrap gap-2">
                                {tags?.map((tag) => (
                                  <Tag key={tag} text={tag} />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300">{summary}</p>
                          </div>
                          <Link
                            href={`/${path}`}
                            className="group inline-flex items-center text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
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

              {pagination && pagination.totalPages > 1 && (
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
