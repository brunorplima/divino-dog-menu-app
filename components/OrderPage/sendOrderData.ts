import { MenuItemGroup, Order } from '../../models/interfaces'
import OrderModel from '../../models/OrderModel'

export const CURRENT_ORDERS_KEY = 'currentOrderIds'

function sendOrderData(items: MenuItemGroup[], func: (orderId: string) => void, isDelivery = false) {
   const order: Pick<Order, 'items' | 'isDelivery'> = {
      items,
      isDelivery,
   }

   const orderData = new OrderModel(order)

   try {
      orderData.save()
      func(orderData.id)
   } catch (error: any) {
      console.log(error.message)
   }
}

export default sendOrderData
