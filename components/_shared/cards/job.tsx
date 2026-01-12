import Image from "next/image"
import { MapPin, Hammer } from "lucide-react"

interface JobCardProps {
  title: string
  location: string
  salary: string
  image: string
}

const JobCard = ({ title, location, salary, image }: JobCardProps) => {
  return (
    <div className="group relative flex flex-col md:flex-row overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300">

      {/* Image Section */}
      <div className="relative h-48 md:h-auto md:w-56 flex-shrink-0">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <span className="absolute bottom-3 left-3 text-white text-sm font-semibold flex items-center gap-1">
          <Hammer size={16} /> Skilled Job
        </span>
      </div>

      {/* Content Section */}
      <div className="flex flex-col justify-between p-5 flex-1">

        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900 leading-tight">
            {title}
          </h2>

          <div className="flex items-center gap-1 text-sm text-gray-500">
            <MapPin size={16} />
            <span>{location}</span>
          </div>

          <div className="inline-flex w-fit items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
            {salary} / month
          </div>
        </div>

        {/* CTA */}
        <button className="mt-4 w-full md:w-fit rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition">
          नौकरी देखें
        </button>
      </div>
    </div>
  )
}

export default JobCard
