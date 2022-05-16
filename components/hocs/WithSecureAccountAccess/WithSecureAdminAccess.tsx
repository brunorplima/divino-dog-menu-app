import React, { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { isAdminUser } from '../../../utils/modelHelper'
import { authContext } from '../../contexts/AuthProvider'

interface Props {
   readonly children: React.ReactNode
}

const WithSecureAdminAccess: React.FC<Props> = ({ children }) => {
   const { user, fbUser } = useContext(authContext)
   const router = useRouter()

   useEffect(() => {
      if (!fbUser) router.push('/login')
      if (fbUser && user && !isAdminUser(user)) router.push('/account')
   }, [fbUser])

   if (fbUser && user && isAdminUser(user)) {
      return <>{children}</>
   }

   return null
}

export default WithSecureAdminAccess
