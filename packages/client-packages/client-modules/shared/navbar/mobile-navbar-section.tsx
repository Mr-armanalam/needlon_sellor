'use client'
import { mobileNavData } from '@/lib/data/nav-data';
import Link from 'next/link';
import { usePathname } from "next/navigation";


const MobileNavbarSection = () => {
  const pathname = usePathname();
  return (
    <div className='xl:hidden sticky bottom-0 right-0 mt-auto px-8 py-3 h-fit flex items-center justify-between bg-white z-50 border-t left-0'>
      {mobileNavData.map((item, index) => (
        <Link href={`${item.link}`} key={index} className='flex items-center flex-col'>
          {pathname === item.link ?  
          <item.activeIcon className='text-blue-600' size={item.label === 'Account' ? 28 : 30 } />:
          <item.icon size={item.label === 'Account' ? 28 : 30 } />}
          <p className='text-xs'>{item.label}</p>
        </Link>
        ))}
    </div>
  )
}

export default MobileNavbarSection