import React from 'react'
import Logo from '../components/Logo'
import NavLinks from '../components/NavLinks'
import LanguageSwitcher from '../components/LanguageSwitcher'
import LoginButton from '../components/LoginButton'
import CTAButton from '../components/CTAButton'

const NavbarView = () => {
  return (
    <nav className='flex justify-between h-18 sticky top-0 bg-white border-b text-lg items-center px-6'>
      <Logo />
      <NavLinks />
      <LanguageSwitcher />
      <LoginButton />
      <CTAButton />
    </nav>
  )
}

export default NavbarView