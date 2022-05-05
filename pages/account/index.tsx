import { signOut } from 'firebase/auth'
import { useRouter } from 'next/router'
import React, { useContext, useEffect } from 'react'
import { AiOutlineLogout } from 'react-icons/ai'
import { authContext } from '../../components/contexts/AuthProvider'

const AccountPage = () => {
   const { user, auth, fbUser } = useContext(authContext)
   const router = useRouter()

   useEffect(() => {
      if (!fbUser) router.push('login')
   }, [fbUser])

   function logout() {
      if (auth) signOut(auth)
   }

   if (!fbUser || !user) return null

   return (
      <div className='text-xl bg-gray-700 h-screen w-screen flex justify-center items-center text-white'>
         <div className='lg:w-1/2 w-80'>
            <div className="flex items-center justify-between mb-4">
               <div className='text-3xl'>
                  <h3>{user.firstName} {user.lastName}</h3>
               </div>

               <div
                  className="w-12 flex justify-center bg-gray-300 hover:bg-gray-200 duration-300 text-black rounded py-1 items-center h-100 text-3xl cursor-pointer"
                  onClick={logout}
               >
                  <AiOutlineLogout/>
               </div>
            </div>

            <div className="flex flex-col">
               <div className="flex justify-between">
                  <span>Email:</span>
                  <span>{user?.emailAddress ? user.emailAddress : '--'}</span>
               </div>
               <div className="flex justify-between">
                  <span>Endereço:</span>
                  <span>{user?.addresses && user.addresses.length ? user.addresses[0].description : '--'}</span>
               </div>
               <div className="flex justify-between">
                  <span>Contato 1:</span>
                  <span>{user?.phoneContact1 ? user.phoneContact1 : '--'}</span>
               </div>
               <div className="flex justify-between">
                  <span>Contato 2:</span>
                  <span>{user?.phoneContact2 ? user.phoneContact2 : '--'}</span>
               </div>
               <div className="flex justify-between">
                  <span>Data Nascimento:</span>
                  <span>{user?.dateOfBirth ? user.dateOfBirth.toLocaleDateString() : '--'}</span>
               </div>
            </div>
         </div>
      </div>
   )
}

export default AccountPage
