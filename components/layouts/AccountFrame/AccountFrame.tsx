import React, { useContext } from 'react'
import AccountNavbar from '../../book/AccountNavbar'
import { FaColumns } from 'react-icons/fa'
import { GiHotDog } from 'react-icons/gi'
import { IoSettingsSharp } from 'react-icons/io5'
import { adminContext } from '../../contexts/AdminProvider'


const AdminAccountFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
   const { setCurrenctSection } = useContext(adminContext)

   return (
      <div className='h-screen'>
         <AccountNavbar
            options={[
               {
                  label: 'Pedidos',
                  Icon: FaColumns,
                  clickHandler: () => setCurrenctSection('orders')
               },
               {
                  label: 'Produtos',
                  Icon: GiHotDog,
                  clickHandler: () => setCurrenctSection('products')
               },
               {
                  label: 'Configurações',
                  Icon: IoSettingsSharp,
                  clickHandler: () => setCurrenctSection('settings')
               }
            ]}
         />
         <div className='overflow-x-scroll'>
            {children}
         </div>
      </div>
   )
}

export default AdminAccountFrame
