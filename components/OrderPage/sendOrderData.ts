import { MenuItemGroup, Order } from '../../models/interfaces'
import OrderModel from '../../models/OrderModel'
import { setLocalStorageItem } from '../../utils/localStorageHelper'

export const ORDER_KEY = 'orderData'

function sendOrderData(items: MenuItemGroup[], func: () => void, isDelivery = false) {
   const order: Pick<Order, 'items' | 'isDelivery'> = {
      items,
      isDelivery,
   }

   const orderData = new OrderModel(order)

   try {
      orderData.save()
      func()
      const orderId = orderData.id
      setLocalStorageItem(ORDER_KEY, orderId)
   } catch (error) {
      console.log(error)
   }
}

export default sendOrderData
