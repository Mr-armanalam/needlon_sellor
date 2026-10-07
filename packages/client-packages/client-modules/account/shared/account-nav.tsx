'use client'
import React from 'react'
import UserHeader from '../components/user-header'
import { useSession } from 'next-auth/react'
import AccountNavItems from '../ui/account-nav-items'

const AccountNav = () => {
  const {data: session} = useSession();
  const loginUser = session?.user
  return (
    <div className='h-full'>
      <UserHeader name={loginUser?.name}/>
      <AccountNavItems />
    </div>
  )
}

export default AccountNav