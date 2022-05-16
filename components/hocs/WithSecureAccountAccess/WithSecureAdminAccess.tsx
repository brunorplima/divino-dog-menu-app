import { useRouter } from 'next/router'
import React, { useContext, useEffect } from 'react'
import { isAdminUser } from '../../../utils/modelHelper'
import { authContext } from '../../contexts/AuthProvider'

const WithSecureAdminAccess = (Component: React.ComponentType) => {
   const router = useRouter()
   const { user, fbUser } = useContext(authContext)

   useEffect(() => {
      if (!fbUser) router.push('/login')
      if (fbUser && user && !isAdminUser(user)) router.push('/account')
   }, [fbUser])

   if (fbUser && user && isAdminUser(user)) {
      return <Component />
   }

   return null
}

export default WithSecureAdminAccess
