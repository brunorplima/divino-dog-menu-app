import React, { useState } from 'react'
import AdminProductsSection from '../../components/book/AdminProductsSection'
import OrderManager from '../../components/book/OrderManager'
import WithSecureAdminAccess from '../../components/hocs/WithSecureAccountAccess'
import AccountFrame from '../../components/layouts/AccountFrame'

export type AdminSection = 'orders' | 'products' | 'settings'

const AdminPage = () => {
   const [section, setSection] = useState<AdminSection>('orders')

   return (
      <WithSecureAdminAccess>
         <AccountFrame setSection={setSection}>
            {section === 'orders' && <OrderManager />}
            {section === 'products' && <AdminProductsSection />}
            {section === 'settings' && <></>}
         </AccountFrame>
      </WithSecureAdminAccess>
   )
}

export default AdminPage
