import * as R from 'ramda'
import { db } from '../firebase/app'
import { collection, deleteDoc, doc, getDoc, onSnapshot, query, Query, setDoc, Unsubscribe } from "firebase/firestore";
import Model from './Model';
import { Order } from './interfaces';

export default class OrderModel extends Model<Order> {

   constructor(public order: Order) {
      super()
   }
   
   static get PATH(): string { return 'orders' }

   static async find(id: string) {
      const docRef = await getDoc(doc(db, OrderModel.PATH, id))
      
      if (!docRef.exists()) return null

      return docRef.data() as Order
   }

   static listenToAll(setFunction: Function): Unsubscribe {
      const q = query(collection(db, OrderModel.PATH))
      
      const unsubscribe = onSnapshot(q, snapshot => {
         const orders: Order[] = []
         snapshot.forEach(document => orders.push(document.data() as Order))
         setFunction(orders)
      })
      
      return unsubscribe
   }

   static listenToQuery(q: Query, setFunction: Function): Unsubscribe {
      const unsubscribe = onSnapshot(q, snapshot => {
         const orders: Order[] = []
         snapshot.forEach(document => orders.push(document.data() as Order))
         setFunction(orders)
      })
      
      return unsubscribe
   }

   values() {
      return this.order
   }

   isValid() {
      const { id, codeNumber, totalPrice, items } = this.order

      if (id.length !== 13) return false

      if (!codeNumber) return false

      if (totalPrice < 0) return false

      if (!items.length) return false

      return true
   }

   modify(values: Partial<Omit<Order, 'id'>>) {
      this.order = R.mergeRight(this.order, values)
   }

   async save() {
      if (!this.isValid()) throw new Error('One or more of the values is/are not valid')

      const { id } = this.order
      
      const docRef = doc(db, OrderModel.PATH, id)
      
      await setDoc(docRef, this.order)
   }

   async delete() {
      const { id } = this.order

      return await deleteDoc(doc(db, OrderModel.PATH, id))
   }

   toString() {
      return `Pedido No ${this.order.codeNumber}: R$ ${this.order.totalPrice.toFixed(2)}`
   }
}
