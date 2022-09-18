import React from 'react'
import { IoCloseSharp } from 'react-icons/io5'
import { MdOutlineManageSearch, MdPlaylistAddCheck } from 'react-icons/md'
import UserModel from '../../../models/UserModel'
import { UserSearchForm } from '../../forms/AdminUsersSearchForm/AdminUsersSearchForm'
import AdminUsersSearchItem from './AdminUsersSearchItem'

interface Props {
   readonly users: UserModel[]
   readonly filteredUsers: UserModel[] | null
   readonly searchValues: UserSearchForm | null
   readonly setUserToEdit: React.Dispatch<React.SetStateAction<UserModel | null>>
   readonly setFilteredUsers: React.Dispatch<React.SetStateAction<UserModel[] | null>>
}

const AdminUsersSearchResults: React.FC<Props> = ({
   users,
   filteredUsers,
   searchValues,
   setUserToEdit,
   setFilteredUsers
}) => {
   return (
      <div className='p-3'>
         {!filteredUsers && (
            <>
               <div className="py-2 mb-3">
                  <div className='flex'>
                     <MdPlaylistAddCheck size={20}/>
                     <div className='ml-2'>Últimos {users.length} usuários a se cadastrarem</div>
                  </div>
               </div>
               {users.map((user) => <AdminUsersSearchItem key={user.id} {...{ user, setUserToEdit }} />)}
            </>
         )}

         {filteredUsers && (
            <>
               <div className="py-2 mb-3 flex">
                  <div className='flex'>
                     <MdOutlineManageSearch size={20}/>
                     <div className='ml-2'>{filteredUsers.length} resultados para</div>
                  </div>
                  <div className="flex items-center rounded-md bg-green-600 px-1 text-md ml-2" onClick={() => setFilteredUsers(null)}>
                     {searchValues?.searchText}
                     <div className="w-2"></div>
                     <IoCloseSharp />
                  </div>
               </div>
               {filteredUsers.map((user) => <AdminUsersSearchItem key={user.id} {...{ user, setUserToEdit }} />)}
            </>
         )}
      </div>
   )
}

export default AdminUsersSearchResults
