'use client'
import SeasonCard from '../ui/season-card'
import { Button } from '@/components/ui/button'
import { ClientProductItem } from '@/types/product'
import { useRouter } from 'next/navigation'

type seasonDataProps = {
  seasonData : ClientProductItem[],
  navigateTo: string
}

const SeasonSection = ({seasonData, navigateTo}: seasonDataProps) => {
  const router = useRouter();
  return (
    <div className='pb-12 pt-12'>
      <h1 className='text-center text-5xl xl:text-6xl text-gray-900 font-garamond dark:text-white'>This Season</h1>
      <p className="text-center max-sm:text-sm mt-1 text-muted-foreground">Celebrate the season with styles that fit you perfectly</p>
      <div className="flex max-sm:px-2 no-scrollbar overflow-x-auto relative justify-between gap-x-4 mt-12">
        {seasonData.map((item, k)=>(
          <SeasonCard key={k} productData={item} />
        ))}
        <Button onClick={() => router.push(navigateTo)} variant={'secondary'} className='sticky rounded-r-none right-0 top-1/2 -translate-y-1/2 h-37.5 px-2.5 text-2xl'>&gt;</Button>
      </div>
    </div>
  )
}

export default SeasonSection