import { signOut } from 'firebase/auth'
import { useRouter } from 'next/router'
import React, { useContext, useEffect } from 'react'
import AdminUserAccount from '../../components/book/AdminUserAccount'
import RegularUserAccount from '../../components/book/RegularUserAccount'
import { authContext } from '../../components/contexts/AuthProvider'
import AccountFrame from '../../components/layouts/AccountFrame'

const AccountPage = () => {
   const { user, auth, fbUser } = useContext(authContext)
   const router = useRouter()

   useEffect(() => {
      if (!fbUser) router.push('login')
   }, [fbUser])

   function logout() {
      if (auth) signOut(auth)
   }

   function isAdminOrMaster() {
      if (user) return Boolean(user.admin || user.master)
      return false
   }

   if (!fbUser || !user) return null

   return (
      <>
         {
            !isAdminOrMaster() && <RegularUserAccount {...{ user, logout }} />
         }

         {isAdminOrMaster() &&
            <AccountFrame>
               <AdminUserAccount />
            </AccountFrame>
         }
      </>
   )
}

export default AccountPage
