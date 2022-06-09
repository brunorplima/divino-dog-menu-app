import { MenuItemGroup, Order } from '../../models/interfaces'
import OrderModel from '../../models/OrderModel'
import { setLocalStorageItem } from '../../utils/localStorageHelper'

export const ORDER_KEY = 'orderData'

function sendOrderData(customerOrder: MenuItemGroup[], delivery = false) {
   const order: Order = {
      id: '',
      totalPrice: 0,
      codeNumber: '',
      status: 'confirmar',
      items: customerOrder,
      isDelivery: delivery,
   }

   const orderData = new OrderModel(order)

   try {
      orderData.save()
      const orderId = orderData.id
      setLocalStorageItem(ORDER_KEY, orderId)
      console.log(`Order saved under the ${orderId} id`)
      console.log(`\n${orderData}`)
   } catch (error) {
      console.log(error)
   }
}

export default sendOrderData
