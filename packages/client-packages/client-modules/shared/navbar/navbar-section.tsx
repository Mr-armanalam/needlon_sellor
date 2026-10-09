import NavigationItems from './components/navigation-items'
import SearchAndUser from './components/search-and-user'

const NavbarSection = () => {
  return (
    <nav className='flex max-xl:hidden text-sm justify-between items-center px-8 py-3 bg-transparent text-black/90 dark:text-white font-medium'>
      <NavigationItems />
      <SearchAndUser />
    </nav>
  )
}

export default NavbarSection