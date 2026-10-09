import React from 'react'
import { ServicePillar } from '../components/service-piller'
import { servicePillarsMens } from '@/data/service-data'

type Props = {
  servicePillars: typeof servicePillarsMens, 
  heading: string, 
  title: string;
  description: string;
}

const ServicePillarSection = ({servicePillars , heading, title, description}: Props) => {
  return (
    <section className="py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-12 h-px bg-[#D4AF37]" />
              <span className="text-[#D4AF37] tracking-widest uppercase text-sm">
               {heading}
              </span>
              <div className="w-12 h-px bg-[#D4AF37]" />
            </div>
            <h2
              className="text-[#1A1D2E] dark:text-white mb-4 text-4xl md:text-5xl"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {title}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              {description}
            </p>
          </div>

          <div className="space-y-32">
            {servicePillars.map((pillar, index) => (
              <ServicePillar
                key={pillar.title}
                title={pillar.title}
                description={pillar.description}
                imageUrl={pillar.imageUrl}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>
  )
}

export default ServicePillarSection