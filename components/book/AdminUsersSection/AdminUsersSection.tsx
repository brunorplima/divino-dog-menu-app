import { limit, orderBy, QueryConstraint, where } from 'firebase/firestore'
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
      const constraints: QueryConstraint[] = [orderBy('firstName', 'asc'), limit(20)]
      const userRes = await UserModel.findMany(constraints)
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
         const whereClauses: QueryConstraint[] = []
         if (searchProp === 'firstName') {
            whereClauses.push(where('firstName', '==', searchText))
         }
         if (searchProp === 'lastName') {
            whereClauses.push(where('lastName', '==', searchText))
         }
         if (searchProp === 'emailAddress') {
            whereClauses.push(where('emailAddress', '==', searchText))
         }
         const usersList = await UserModel.findMany(whereClauses)
         setSearchValues(values)
         setFilteredUsers(usersList)
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
            <h1 className='text-xl'>Usuários</h1>
         </div>

         <AdminUsersSearchForm onSubmit={onSearchSubmit} isLoading={loadingSearch} />

         <AdminUsersSearchResults
            users={users}
            filteredUsers={filteredUsers}
            searchValues={searchValues}
            setUserToEdit={setUserToEdit}
            setFilteredUsers={setFilteredUsers}
         />

         <PrimaryModal
            id='editUserModal'
            isOpen={!R.isNil(userToEdit)}
            title='Editar Usuário'
            onClose={() => setUserToEdit(null)}
         >
            {userToEdit && <AdminUserEditForm user={userToEdit} onSubmit={onEditSubmit} />}
         </PrimaryModal>
      </div>
   )
}

export default AdminUsersSection
