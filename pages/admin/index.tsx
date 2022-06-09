import React, { useState } from 'react'
import AdminProductsSection from '../../components/book/AdminProductsSection'
import AdminSettingsSection from '../../components/book/AdminSettingsSection'
import OrderManager from '../../components/book/OrderManager'
import WithSecureAdminAccess from '../../components/hocs/WithSecureAccountAccess'
import AccountFrame from '../../components/layouts/AccountFrame'

export type AdminSection = 'orders' | 'products' | 'settings' | 'canceledOrders'

const AdminPage = () => {
   const [section, setSection] = useState<AdminSection>('orders')

   return (
      <WithSecureAdminAccess>
         <AccountFrame setSection={setSection}>
            {section === 'orders' && <OrderManager />}
            {section === 'products' && <AdminProductsSection />}
            {section === 'settings' && <AdminSettingsSection />}
         </AccountFrame>
      </WithSecureAdminAccess>
   )
}

export default AdminPage
