import { mobileCategoriesData } from '@/public/icon-assets/mobile-categories'
import Image from 'next/image'
import Link from 'next/link'

const page = () => {
  return (
    <section className='px-3 md:hidden mb-8 mt-3 flex flex-col gap-y-8'>
      {
        mobileCategoriesData.map((item, index) => (
          <div key={index}>
            <p className='text-xl font-garamond mb-3'>{item.name}</p>
            <div className='grid grid-cols-3 gap-x-2 gap-y-4 items-center '>
              {item.navigator.map((navItem, i) => (
                <Link href={navItem.navigate} key={navItem.label+i} className='flex bg-gray-100 p-3 rounded-md flex-col items-center'>
                  <div className="relative h-12 w-12">
                    <Image src={navItem.icon} fill alt={navItem.label} />
                  </div>
                  <p className='text-nowrap text-xs'>{navItem.label}</p>
                </Link>
              ))}
            </div>
          </div>
        ))
      }
    </section>
  )
}

export default page