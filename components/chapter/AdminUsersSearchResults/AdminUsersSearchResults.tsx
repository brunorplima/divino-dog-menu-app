import React, { useMemo, useState } from 'react'
import { IoCloseSharp } from 'react-icons/io5'
import { MdAdminPanelSettings } from 'react-icons/md'
import UserModel from '../../../models/UserModel'
import { UserSearchForm } from '../../forms/AdminUsersSearchForm/AdminUsersSearchForm'
import AdminUsersSearchItem from './AdminUsersSearchItem'
import { descend, prop, sort } from 'ramda'
import { HiUsers } from 'react-icons/hi'
import { BsArrowLeftSquareFill, BsArrowRightSquareFill } from 'react-icons/bs'

const PAGE_SIZE = 10

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
   const [pagination, setPagination] = useState(1)
   const [maxPage, setMaxPage] = useState(1)
   const [regularUsersNumber, setRegularUsersNumber] = useState(0)

   const changePagination = (num: number) => {
      if (num < 1) setPagination(1)
      else if (num > maxPage) setPagination(maxPage)
      else setPagination(num)
   }

   const userListing = useMemo(() => {
      const listing = filteredUsers ? filteredUsers : users
      const adminUsers = sort(descend(prop('signUpDate')), listing.filter(user => user.admin))
      const preRegularUsers = sort(descend(prop('signUpDate')), listing.filter(user => !user.admin && !user.master))
      setMaxPage(Math.ceil((preRegularUsers.length / PAGE_SIZE)))
      setRegularUsersNumber(preRegularUsers.length)
      const regularUsers = preRegularUsers.filter((u, idx) => {
         const min = PAGE_SIZE * pagination - (PAGE_SIZE - 1)
         const max = PAGE_SIZE * pagination
         const index = idx + 1
         return index >= min && index <= max
      })
      return { adminUsers, regularUsers }
   }, [users, filteredUsers, userToEdit, pagination])

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
               <div className="py-2 mb-1">
                  <div className='flex'>
                     <HiUsers size={20}/>
                     <div className='ml-2 flex justify-between w-full'>
                        <div>{regularUsersNumber} usuário{regularUsersNumber !== 1 && 's'}</div>
                        <div className='flex gap-5 justify-center'>
                           <div
                              onClick={() => changePagination(pagination - 1)}
                              style={pagination <= 1 ? { opacity: 0.3 } : {}}
                           >
                              <BsArrowLeftSquareFill size={26} />
                           </div>
                        
                           <div
                              onClick={() => changePagination(pagination + 1)}
                              style={pagination >= maxPage ? { opacity: 0.3 } : {}}
                           >
                              <BsArrowRightSquareFill size={26} />
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               {userListing.regularUsers.map((user) => <AdminUsersSearchItem key={user.id} {...{ user, setUserToEdit }} />)}
               <div className='py-2 mb-4'>
                  <div className='flex gap-5 justify-center'>
                     <div
                        onClick={() => changePagination(pagination - 1)}
                        style={pagination <= 1 ? { opacity: 0.3 } : {}}
                     >
                        <BsArrowLeftSquareFill size={26} />
                     </div>
                  
                     <div
                        onClick={() => changePagination(pagination + 1)}
                        style={pagination >= maxPage ? { opacity: 0.3 } : {}}
                     >
                        <BsArrowRightSquareFill size={26} />
                     </div>
                  </div>
               </div>
            </>
         )}
      </div>
   )
}

export default AdminUsersSearchResults
