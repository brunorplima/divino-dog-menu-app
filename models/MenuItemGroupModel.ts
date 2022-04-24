import * as R from 'ramda'
import { db } from '../firebase/app'
import { collection, deleteDoc, doc, getDoc, onSnapshot, query, Query, setDoc, Unsubscribe } from "firebase/firestore";
import Model from './Model';
import { MenuItemGroup } from './interfaces';

export default class MenuItemGroupModel extends Model<MenuItemGroup> {

   constructor(public menuItemGroup: MenuItemGroup) {
      super()
   }
   
   static get PATH(): string { return `menuItemGroups` }

   static async find(id: string = '', orderId: string = '') {
      const docRef = await getDoc(doc(db, MenuItemGroupModel.getPrefixedPath(orderId), id))
      
      if (!docRef.exists()) return null

      return docRef.data() as MenuItemGroup
   }

   static listenToAll(orderId: string, setFunction: Function): Unsubscribe {
      const q = query(collection(db, MenuItemGroupModel.getPrefixedPath(orderId)))
      
      const unsubscribe = onSnapshot(q, snapshot => {
         const menuItemGroups: MenuItemGroup[] = []
         snapshot.forEach(document => menuItemGroups.push(document.data() as MenuItemGroup))
         setFunction(menuItemGroups)
      })
      
      return unsubscribe
   }

   static listenToQuery(q: Query, setFunction: Function): Unsubscribe {
      const unsubscribe = onSnapshot(q, snapshot => {
         const menuItemGroups: MenuItemGroup[] = []
         snapshot.forEach(document => menuItemGroups.push(document.data() as MenuItemGroup))
         setFunction(menuItemGroups)
      })
      
      return unsubscribe
   }

   static getPrefixedPath(orderId: string) : string {
      return `orders/${orderId}/${MenuItemGroupModel.PATH}`
   }

   getPrefixedPath(): string {
      return `orders/${this.values().orderId}/${MenuItemGroupModel.PATH}`
   }

   values() {
      return this.menuItemGroup
   }

   isValid() {
      const { id, orderId, menuItemId, subTotal } = this.values()

      if (id && id.length !== 13) return false

      if (!orderId || !menuItemId) return false

      if (subTotal < 0) return false

      return true
   }

   modify(values: Partial<Omit<MenuItemGroup, 'id'>>) {
      this.menuItemGroup = R.mergeRight(this.values(), values)
   }

   async save() {
      if (!this.isValid()) throw new Error('One or more of the values is/are not valid')

      const { id } = this.values()
      
      const docRef = doc(db, this.getPrefixedPath(), id)
      
      await setDoc(docRef, this.values())
   }

   async delete() {
      const { id } = this.values()

      return await deleteDoc(doc(db, this.getPrefixedPath(), id))
   }

   toString() {
      return `R$ ${this.values().subTotal.toFixed(2)}`
   }
}
