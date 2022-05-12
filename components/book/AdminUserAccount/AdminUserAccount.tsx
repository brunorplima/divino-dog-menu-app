import React, { useContext } from 'react'
import { adminContext } from '../../contexts/AdminProvider'
import OrderManager from '../OrderManager'

const AdminUserAccount: React.FC = () => {
   const { currentSection } = useContext(adminContext)
   
   return (
      <div className=''>
         {currentSection === 'orders' && <OrderManager />}
      </div>
   )
}

export default AdminUserAccount