import projectsData from '@/data/projectsData'
import Card from '@/components/Card'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Projects' })

export default function Projects() {
  return (
    <div className="mx-auto px-4 sm:px-6 xl:px-0">
      <div className="space-y-8 pb-12 pt-16">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 sm:text-4xl">
            Projects
          </h1>
          <p className="font-mono text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Things I have built
          </p>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {projectsData.map((project) => (
            <div key={project.title} className="py-12">
              <Card
                title={project.title}
                description={project.description}
                imgSrc={project.imgSrc}
                href={project.href}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
