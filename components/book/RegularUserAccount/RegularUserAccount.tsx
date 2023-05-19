import React from 'react'
import { AiOutlineLogout } from 'react-icons/ai';
import UserModel from '../../../models/UserModel';

interface Props {
   readonly user: UserModel | null
   readonly logout: () => void
}

const RegularUserAccount: React.FC<Props> = ({ user, logout }) => {
   return (
      <div className='text-xl bg-gray-700 h-screen w-screen flex justify-center items-center text-white'>
         <div className='lg:w-1/2 w-80'>
            <div className="flex items-center justify-between mb-4">
               <div className='text-3xl'>
                  {user && <h3>{user.firstName} {user.lastName}</h3>}
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
                  <span>Address:</span>
                  <span>{user?.addresses && user.addresses.length ? user.addresses[0].description : '--'}</span>
               </div>
               <div className="flex justify-between">
                  <span>Contact 1:</span>
                  <span>{user?.phoneContact1 ? user.phoneContact1 : '--'}</span>
               </div>
               <div className="flex justify-between">
                  <span>Contact 2:</span>
                  <span>{user?.phoneContact2 ? user.phoneContact2 : '--'}</span>
               </div>
               <div className="flex justify-between">
                  <span>DOB:</span>
                  <span>{user?.dateOfBirth ? user.dateOfBirth.toLocaleDateString() : '--'}</span>
               </div>
            </div>
         </div>
      </div>
   )
};

export default RegularUserAccount;
