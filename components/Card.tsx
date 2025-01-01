import Image from './Image'
import Link from './Link'
import { ArrowRight } from 'lucide-react'

const Card = ({ title, description, imgSrc, href }) => (
  <div className="flex flex-col items-start lg:flex-row lg:items-start">
    <div className="relative w-full lg:w-2/5">
      {imgSrc &&
        (href ? (
          <Link href={href} aria-label={`Link to ${title}`}>
            <Image
              alt={title}
              src={imgSrc}
              className="aspect-[16/9] w-full object-cover"
              width={544}
              height={306}
            />
          </Link>
        ) : (
          <Image
            alt={title}
            src={imgSrc}
            className="aspect-[16/9] w-full object-cover"
            width={544}
            height={306}
          />
        ))}
    </div>
    <div className="flex flex-1 flex-col justify-between space-y-4 py-6 lg:pl-8 lg:pt-0">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          {href ? (
            <Link href={href} aria-label={`Link to ${title}`}>
              {title}
            </Link>
          ) : (
            title
          )}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      </div>
      {href && (
        <Link
          href={href}
          className="group inline-flex items-center text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          aria-label={`Link to ${title}`}
        >
          View project
          <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  </div>
)

export default Card
