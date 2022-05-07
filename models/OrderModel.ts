import * as R from 'ramda'
import { db } from '../firebase/app'
import {
   collection,
   deleteDoc,
   doc,
   getDoc,
   onSnapshot,
   query,
   Query,
   serverTimestamp,
   setDoc,
   Unsubscribe
} from "firebase/firestore";
import Model from './Model';
import { Order, OrderStatus } from './interfaces';
import { generateID, generateOrderCodeNumber } from '../utils/modelHelper';
import { ORDER_ACTIVE_STATUTES, ORDER_STATUSES } from '../constants/modelsConstants';

export default class OrderModel extends Model<Order> {

   private order: Order

   constructor(order: Order | Pick<Order, 'items' | 'isDelivery'>, existingCodeNumbers: string[] = []) {
      super()
      const { items, isDelivery } = order
      if (R.propOr(false, 'id', order)) this.order = order as Order
      else {
         this.order = {
            id: generateID(),
            totalPrice: items.reduce((acc, { subTotal }) => acc += subTotal, 0),
            codeNumber: generateOrderCodeNumber(existingCodeNumbers),
            status: 'confirmar',
            items,
            isDelivery
         }
      }
   }
   
   static get PATH(): string { return 'orders' }

   static async find(id: string) {
      const docRef = await getDoc(doc(db, OrderModel.PATH, id))
      
      if (!docRef.exists()) return null

      const model: Order = R.mergeRight<Order, Partial<Order>>(
         docRef.data() as Order,
         {
            dateTime: docRef.data().dateTime.toDate(),
            statusUpdatedAt: docRef.data().statusUpdatedAt.toDate()
         }
      )
      const orderModel = new OrderModel(model)

      return orderModel
   }

   static listenToAll(setFunction: Function): Unsubscribe {
      const q = query(collection(db, OrderModel.PATH))
      
      const unsubscribe = onSnapshot(q, snapshot => {
         if (!snapshot.metadata.hasPendingWrites) {
            const orders: OrderModel[] = []  
            snapshot.forEach(document => {
               const order = document.data()
               if (order.dateTime) order.dateTime = order.dateTime.toDate()
               if (order.statusUpdatedAt) order.statusUpdatedAt = order.statusUpdatedAt.toDate()
               const orderModel = new OrderModel(order as Order)
               orders.push(orderModel)
            })
            setFunction(orders)
         }
      })
      
      return unsubscribe
   }

   static listenToQuery(q: Query, setFunction: Function): Unsubscribe {
      const unsubscribe = onSnapshot(q, snapshot => {
         if (!snapshot.metadata.hasPendingWrites) {
            const orders: OrderModel[] = []
            snapshot.forEach(document => {
               const order = document.data()
               if (order.dateTime) order.dateTime = order.dateTime.toDate()
               if (order.statusUpdatedAt) order.statusUpdatedAt = order.statusUpdatedAt.toDate()
               const orderModel = new OrderModel(order as Order)
               orders.push(orderModel)
            })
            setFunction(orders)
         }
      })
      
      return unsubscribe
   }

   get id()                { return this.order.id }
   get totalPrice()        { return this.order.totalPrice }
   get codeNumber()        { return this.order.codeNumber }
   get status()            { return this.order.status }
   get items()             { return this.order.items }
   get isDelivery()        { return this.order.isDelivery }
   get dateTime()          { return this.order.dateTime }
   get statusUpdatedAt()   { return this.order.statusUpdatedAt }

   values() {
      return this.order
   }

   isValid() {
      if (this.id.length !== 13) return false

      if (!this.codeNumber) return false

      if (this.totalPrice < 0) return false

      if (!this.items.length) return false

      return true
   }

   modify(values: Partial<Omit<Order, 'id'>>) {
      this.order = R.mergeRight(this.values(), values)
   }

   async next() {
      if (ORDER_ACTIVE_STATUTES.includes(this.status)) {
         const index = ORDER_STATUSES.findIndex(status => status === this.status)
         this.modify({ status: ORDER_STATUSES[index + 1] })
         try {
            await this.save()
         }
         catch (err: any) {
            console.log(err)
         }
      }
   }

   async toStatus(status: OrderStatus) {
      this.modify({ status })
      try {
         await this.save()
      }
      catch (err: any) {
         console.log(err)
      }
   }

   async save() {
      if (!this.isValid()) throw new Error('One or more of the values is/are not valid')
      
      const docRef = doc(db, OrderModel.PATH, this.id)
      const document = await getDoc(docRef)
      
      if (!document.exists()) {
         const model = R.mergeRight(
            this.values(),
            {
               dateTime: serverTimestamp(),
               statusUpdatedAt: serverTimestamp()
            }
         )
         await setDoc(docRef, model)
      }
      else {
         if (document.data().status === this.status) {
            await setDoc(docRef, this.values())
         }
         else {
            const model = R.mergeRight(
               this.values(),
               { statusUpdatedAt: serverTimestamp() }
            )
            await setDoc(docRef, model)
         }
      }
   }

   async delete() {
      return await deleteDoc(doc(db, OrderModel.PATH, this.id))
   }

   toString() {
      return `Pedido # ${this.codeNumber}: R$ ${this.totalPrice.toFixed(2)}`
   }
}
