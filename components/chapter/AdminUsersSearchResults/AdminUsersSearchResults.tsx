import React, { useMemo } from 'react'
import { IoCloseSharp } from 'react-icons/io5'
import { MdAdminPanelSettings } from 'react-icons/md'
import UserModel from '../../../models/UserModel'
import { UserSearchForm } from '../../forms/AdminUsersSearchForm/AdminUsersSearchForm'
import AdminUsersSearchItem from './AdminUsersSearchItem'
import { descend, prop, sort } from 'ramda'
import { HiUsers } from 'react-icons/hi'

interface Props {
   readonly users: UserModel[]
   readonly filteredUsers: UserModel[] | null
   readonly searchValues: UserSearchForm | null
   readonly setSearchValues: React.Dispatch<React.SetStateAction<UserSearchForm | null>>
   readonly userToEdit: UserModel | null
   readonly setUserToEdit: React.Dispatch<React.SetStateAction<UserModel | null>>
   readonly setFilteredUsers: React.Dispatch<React.SetStateAction<UserModel[] | null>>
}

const AdminUsersSearchResults: React.FC<Props> = ({
   users,
   filteredUsers,
   searchValues,
   setSearchValues,
   userToEdit,
   setUserToEdit,
   setFilteredUsers
}) => {
   const userListing = useMemo(() => {
      const listing = filteredUsers ? filteredUsers : users
      const adminUsers = sort(descend(prop('signUpDate')), listing.filter(user => user.admin))
      const regularUsers = sort(descend(prop('signUpDate')), listing.filter(user => !user.admin && !user.master))
      return { adminUsers, regularUsers }
   }, [users, filteredUsers, userToEdit])

   const clearSearch = () => {
      setFilteredUsers(null)
      setSearchValues(null)
   }

   return (
      <div className='p-3'>
         {searchValues?.searchText && (
            <>
               <div className="py-2 mb-3 flex">
                  <div>Resultados de</div>
                  <div className="flex items-center rounded-md bg-green-600 px-1 text-md ml-2" onClick={clearSearch}>
                     {searchValues.searchText}
                     <div className="w-2"></div>
                     <IoCloseSharp />
                  </div>
               </div>
            </>
         )}
         
         {!!userListing.adminUsers.length && (
            <>
               <div className="py-2 mb-3">
                  <div className='flex'>
                     <MdAdminPanelSettings size={20}/>
                     <div className='ml-2'>Administradores</div>
                  </div>
               </div>
               {userListing.adminUsers.map((user) => <AdminUsersSearchItem key={user.id} {...{ user, setUserToEdit }} />)}
            </>
         )}

         {!!userListing.adminUsers.length && !!userListing.regularUsers.length && <><br/></>}

         {!!userListing.regularUsers.length && (
            <>
               <div className="py-2 mb-3">
                  <div className='flex'>
                     <HiUsers size={20}/>
                     <div className='ml-2'>Últimos {userListing.regularUsers.length} usuários a se cadastrarem</div>
                  </div>
               </div>
               {userListing.regularUsers.map((user) => <AdminUsersSearchItem key={user.id} {...{ user, setUserToEdit }} />)}
            </>
         )}
      </div>
   )
}

export default AdminUsersSearchResults
