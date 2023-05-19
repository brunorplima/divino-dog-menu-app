import React from 'react'
import * as R from 'ramda'
import AccountNavbar from '../../book/AccountNavbar'
import { FaColumns, FaUsers } from 'react-icons/fa'
import { GiHotDog } from 'react-icons/gi'
import { IoSettingsSharp } from 'react-icons/io5'
import { AdminSection } from '../../../pages/admin'
import { MdOutlineCreditCardOff } from 'react-icons/md'
import UserModel from '../../../models/UserModel'

interface Props {
   readonly children: React.ReactNode
   readonly setSection: React.Dispatch<React.SetStateAction<AdminSection>>
   readonly user: UserModel
}

const AdminAccountFrame: React.FC<Props> = ({ children, setSection, user }) => {
   const getNavBarOptions = () => {
      const options = [
         {
            label: 'Orders',
            Icon: FaColumns,
            clickHandler: () => setSection('orders')
         },
         {
            label: 'Products',
            Icon: GiHotDog,
            clickHandler: () => setSection('products')
         },
         {
            label: 'Settings',
            Icon: IoSettingsSharp,
            clickHandler: () => setSection('settings')
         },
         {
            label: 'Cancelled Orders',
            Icon: MdOutlineCreditCardOff,
            clickHandler: () => setSection('canceledOrders')
         }
      ]
      const usersOption = {
         label: 'Users',
         Icon: FaUsers,
         clickHandler: () => setSection('users')
      }
      
      if (user.master) {
         return R.insert(3, usersOption, options)
      }
      return options
   }

   return (
      <div className='h-screen text-gray-200 flex flex-col'>
         <AccountNavbar
            options={getNavBarOptions()}
         />
         <div className='overflow-x-scroll flex-1'>
            {children}
         </div>
      </div>
   )
}

export default AdminAccountFrame
