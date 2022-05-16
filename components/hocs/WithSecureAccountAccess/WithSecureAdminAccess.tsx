import { useRouter } from 'next/router'
import React, { useContext, useEffect } from 'react'
import { isAdminUser } from '../../../utils/modelHelper'
import { authContext } from '../../contexts/AuthProvider'

const WithSecureAdminAccess = (Component: React.ComponentType) =>
   function () {
      const { user, fbUser } = useContext(authContext)
      const router = useRouter()

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
