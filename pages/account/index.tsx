import { signOut } from 'firebase/auth'
import { useRouter } from 'next/router'
import React, { useContext, useEffect } from 'react'
import RegularUserAccount from '../../components/book/RegularUserAccount'
import { authContext } from '../../components/contexts/AuthProvider'
import { isAdminUser } from '../../utils/modelHelper'

const AccountPage = () => {
   const { user, auth, fbUser } = useContext(authContext)
   const router = useRouter()

   useEffect(() => {
      if (!fbUser) router.push('login')
      if (fbUser && user && isAdminUser(user)) router.push('admin')
   }, [fbUser])

   function logout() {
      if (auth) signOut(auth)
   }

   if (fbUser && user && !isAdminUser(user)) {
      return (
         <RegularUserAccount {...{ user, logout }} />
      )
   }

   return null
}

export default AccountPage
