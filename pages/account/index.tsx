import { signOut } from 'firebase/auth'
import { useRouter } from 'next/router'
import React, { useContext, useEffect } from 'react'
import AdminUserAccount from '../../components/book/AdminUserAccount/AdminUserAccount'
import RegularUserAccount from '../../components/book/RegularUserAccount/RegularUserAccount'
import { adminContext } from '../../components/contexts/AdminProvider'
import { authContext } from '../../components/contexts/AuthProvider'

const AccountPage = () => {
   const { user, auth, fbUser } = useContext(authContext)
   const { activeOrders, latestFinalizedOrders } = useContext(adminContext)
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

         {isAdminOrMaster() && (
               <AdminUserAccount
                  orders={activeOrders}
                  finalizedOrders={latestFinalizedOrders}
               />
            )
         }
      </>
   )
}

export default AccountPage
