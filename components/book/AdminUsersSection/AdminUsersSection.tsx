import { collection, getDocs, limit, orderBy, query, QueryConstraint, Unsubscribe, where } from 'firebase/firestore'
import * as R from 'ramda'
import React, { useContext, useEffect, useState } from 'react'
import { db } from '../../../firebase/app'
import { User } from '../../../models/interfaces'
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
   let unsubscribeUsers: Unsubscribe = () => {}

   useEffect(() => {
      if (!users.length) unsubscribeUsers = fetchUsers()
      return unsubscribeUsers
   }, [])

   useEffect(() => {
      if (!filteredUsers) unsubscribeUsers()
   }, [filteredUsers])

   useEffect(() => {
      if (R.isNil(filteredUsers) && !R.isNil(searchValues)) setSearchValues(null)
   }, [filteredUsers])

   function fetchUsers() {
      const usersRef = collection(db, UserModel.PATH)
      const usersQuery = query(usersRef, orderBy('firstName', 'asc'), limit(20))
      const unsubscribe = UserModel.listenToQuery(usersQuery, setUsers)
      return unsubscribe
   }

   function onSearchSubmit(values: UserSearchForm) {
      setLoadingSearch(true)
      try {
         const { searchText, searchProp } = values
         if (!searchText) return
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
         const usersQuery = query(collection(db, UserModel.PATH), ...whereClauses)
         getDocs(usersQuery)
            .then(res => {
               const usersList: UserModel[] = []
               res.docs.forEach(doc => usersList.push(new UserModel(doc.data() as User)))
               setSearchValues(values)
               setFilteredUsers(usersList)
               setLoadingSearch(false)
            })
            .catch(reason => {
               console.log(reason)
               setLoadingSearch(false)
            })
      } catch (err: any) {
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

         <AdminUsersSearchForm onSubmit={onSearchSubmit} disableSearch={loadingSearch} />

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
