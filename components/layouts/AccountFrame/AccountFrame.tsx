import React from 'react'
import AccountNavbar from '../../book/AccountNavbar'
import { FaColumns } from 'react-icons/fa'
import { GiHotDog } from 'react-icons/gi'
import { IoSettingsSharp } from 'react-icons/io5'
import { AdminSection } from '../../../pages/admin'

interface Props {
   readonly children: React.ReactNode
   readonly setSection: React.Dispatch<React.SetStateAction<AdminSection>>
}

const AdminAccountFrame: React.FC<Props> = ({ children, setSection }) => {

   return (
      <div className='h-screen text-gray-200 flex flex-col'>
         <AccountNavbar
            options={[
               {
                  label: 'Pedidos',
                  Icon: FaColumns,
                  clickHandler: () => setSection('orders')
               },
               {
                  label: 'Produtos',
                  Icon: GiHotDog,
                  clickHandler: () => setSection('products')
               },
               {
                  label: 'Configurações',
                  Icon: IoSettingsSharp,
                  clickHandler: () => setSection('settings')
               }
            ]}
         />
         <div className='overflow-x-scroll flex-1 fit-for-mobile'>
            {children}
         </div>
      </div>
   )
}

export default AdminAccountFrame
