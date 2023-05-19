import { orderBy, QueryConstraint, where } from 'firebase/firestore'
import * as R from 'ramda'
import React, { useContext, useEffect, useState } from 'react'
import UserModel from '../../../models/UserModel'
import AdminUsersSearchResults from '../../chapter/AdminUsersSearchResults'
import { adminContext } from '../../contexts/AdminProvider'
import { authContext } from '../../contexts/AuthProvider'
import AdminUserEditForm from '../../forms/AdminUserEditForm'
import { ADMIN_USER_TYPE, REGULAR_USER_TYPE, UserEditForm } from '../../forms/AdminUserEditForm/AdminUserEditForm'
import AdminUsersSearchForm, { UserSearchForm } from '../../forms/AdminUsersSearchForm/AdminUsersSearchForm'
import PrimaryModal from '../PrimaryModal'

const AdminUsersSection = () => {
   const [filteredUsers, setFilteredUsers] = useState<UserModel[] | null>(null)
   const [userToEdit, setUserToEdit] = useState<UserModel | null>(null)
   const [searchValues, setSearchValues] = useState<UserSearchForm | null>(null)
   const [loadingSearch, setLoadingSearch] = useState(false)
   const { users, setUsers } = useContext(adminContext)
   const { user } = useContext(authContext)

   useEffect(() => {
      fetchUsers()
   }, [])

   useEffect(() => {
      if (R.isNil(filteredUsers) && !R.isNil(searchValues)) setSearchValues(null)
   }, [filteredUsers])

   async function fetchUsers() {
      const userRes = await UserModel.findMany()
      setUsers(userRes)
   }

   async function onSearchSubmit(values: UserSearchForm) {
      setLoadingSearch(true)
      try {
         const { searchText, searchProp } = values
         if (!searchText) {
            setLoadingSearch(false)
            return
         }
         type Prop = 'firstName' | 'lastName' | 'emailAddress'
         const getFilteredUsers = (prop: Prop) =>
            R.filter(user => user[prop].toLowerCase().includes(searchText.toLowerCase()), users)
         setFilteredUsers(getFilteredUsers(searchProp))
         setSearchValues(values)
         setLoadingSearch(false)
      } catch (err: any) {
         setLoadingSearch(false)
         console.log(err.message)
      }
   }

   function onEditSubmit(value: UserEditForm) {
      try {
         if (value.userType === REGULAR_USER_TYPE) userToEdit?.removeAdminRole(user?.master)
         if (value.userType === ADMIN_USER_TYPE) userToEdit?.addAdminRole(user?.master)
         userToEdit?.save()
         setUserToEdit(null)
      }
      catch (err: any) {
         console.log(err.message)
      }
   }

   return (
      <div className='text-gray-200 mb-14 max-w-3xl ml-auto mr-auto'>
         <div className='grid place-content-center my-4'>
            <h1 className='text-xl'>Users</h1>
         </div>

         <AdminUsersSearchForm onSubmit={onSearchSubmit} isLoading={loadingSearch} searchValues={searchValues} />

         <AdminUsersSearchResults
            users={users}
            filteredUsers={filteredUsers}
            searchValues={searchValues}
            setSearchValues={setSearchValues}
            userToEdit={userToEdit}
            setUserToEdit={setUserToEdit}
            setFilteredUsers={setFilteredUsers}
         />

         <PrimaryModal
            id='editUserModal'
            isOpen={!R.isNil(userToEdit)}
            title='Edit User'
            onClose={() => setUserToEdit(null)}
         >
            {userToEdit && <AdminUserEditForm user={userToEdit} onSubmit={onEditSubmit} />}
         </PrimaryModal>
      </div>
   )
}

export default AdminUsersSection
