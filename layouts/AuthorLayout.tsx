import { ReactNode } from 'react'
import type { Authors } from 'contentlayer/generated'
import SocialIcon from '@/components/social-icons'
import Image from '@/components/Image'

interface Props {
  children: ReactNode
  content: Omit<Authors, '_id' | '_raw' | 'body'>
}

export default function AuthorLayout({ children, content }: Props) {
  const { name, avatar, occupation, company, email, twitter, linkedin, github } = content

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 xl:px-0">
      <div className="space-y-8 pt-16 pb-12">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-4xl dark:text-gray-100">About</h1>
        </div>

        <div className="grid gap-12 pt-4 md:grid-cols-7">
          {/* Author Info */}
          <div className="flex flex-row items-start gap-8 md:col-span-2 md:flex-col">
            {avatar && (
              <div className="w-[150px] overflow-hidden rounded-lg bg-gray-100 lg:w-[200px] dark:bg-gray-800">
                <Image
                  src={avatar}
                  alt="avatar"
                  width={200}
                  height={200}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{name}</h2>
                <div className="space-y-1">
                  <p className="font-mono text-sm text-gray-600 uppercase dark:text-gray-400">
                    {occupation}
                  </p>
                  <p className="font-mono text-sm text-gray-600 uppercase dark:text-gray-400">
                    {company}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <SocialIcon size={6} kind="mail" href={`mailto:${email}`} />
                <SocialIcon size={6} kind="github" href={github} />
                <SocialIcon size={6} kind="linkedin" href={linkedin} />
                <SocialIcon size={6} kind="twitter" href={twitter} />
              </div>
            </div>
          </div>

          {/* Author Bio */}
          <div className="prose prose-gray dark:prose-invert max-w-none md:col-span-5">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
