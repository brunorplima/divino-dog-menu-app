import React from 'react'
import UserModel from '../../../models/UserModel'
import ListItemEditDelete from '../../verse/ListItemEditDelete'

interface Props {
   readonly user: UserModel
   readonly setUserToEdit: React.Dispatch<React.SetStateAction<UserModel | null>>
}

const AdminUsersSearchItem: React.FC<Props> = ({ user, setUserToEdit }) => {
   return (
      <div key={user.id + user.fullName} className="p-3 rounded bg-gray-600 mb-2 flex justify-between">
         <div>
            <div>
               {user.fullName}
               {user.admin &&  (
                  <span className='rounded-md bg-green-600 px-1 text-xs ml-2'>
                     ADMIN
                  </span>
               )}
               {user.master && (
                  <span className='rounded-md bg-green-600 px-1 text-xs ml-2'>
                     MASTER
                  </span>
               )}
            </div>
            <div>{user.emailAddress}</div>
            <div className='my-1'>{user?.mainAddressToString()}</div>
            {user.signUpDate && <div className='my-1 text-sm'>Desde {user.signUpDateToString()}</div>}
            {user.phoneContact1 && <div>Contato 1: {user.phoneContact1}</div>}
            {user.phoneContact2 && <div>Contato 2: {user.phoneContact2}</div>}
         </div>
         {!user.master && (
            <ListItemEditDelete
               modalId={``}
               onEdit={() => setUserToEdit(user)}
            />
         )}
      </div>
   )
}

export default AdminUsersSearchItem
