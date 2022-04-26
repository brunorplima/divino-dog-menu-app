import { MenuItem } from './interfaces'
import * as R from 'ramda'
import { db } from '../firebase/app'
import { collection, deleteDoc, doc, getDoc, onSnapshot, query, Query, setDoc, Unsubscribe } from "firebase/firestore";
import Model from './Model';

export default class MenuItemModel extends Model<MenuItem> {

   constructor(public menuItem: MenuItem) {
      super()
   }
   
   /**
    * Gets the collection path of this model in the database.
    * @returns The collection path
    * @readonly
    */
   static get PATH(): string { return 'menuItems' }

   /**
    * Retrieves a document from the database with the provided ID. 
    * @param id The ID of the document in the database
    * @returns Promise to deliver the document if found
    */
   static async find(id: string) {
      const docRef = await getDoc(doc(db, MenuItemModel.PATH, id))
      
      if (!docRef.exists()) return null

      return docRef.data() as MenuItem
   }

   /**
    * Opens a real time connection with the collection in the databse.
    * @param setFunction - The function to set external state to values return from collection
    * @returns A function returned by firestore's ```onSnapshot()``` that removes the listener when invoked.
    */
   static listenToAll(setFunction: Function): Unsubscribe {
      const q = query(collection(db, MenuItemModel.PATH))
      
      const unsubscribe = onSnapshot(q, snapshot => {
         const menuItems: MenuItem[] = []
         snapshot.forEach(document => menuItems.push(document.data() as MenuItem))
         setFunction(menuItems)
      })
      
      return unsubscribe
   }

   /**
    * Opens a real time connection with the collection in the databse based on the given query.
    * @param q - The ```Query``` to be used
    * @param setFunction - The function to set external state to values returned from query
    * @returns A function returned by firestore's ```onSnapshot()``` that removes the listener when invoked.
    */
   static listenToQuery(q: Query, setFunction: Function): Unsubscribe {
      const unsubscribe = onSnapshot(q, snapshot => {
         const menuItems: MenuItem[] = []
         snapshot.forEach(document => menuItems.push(document.data() as MenuItem))
         setFunction(menuItems)
      })
      
      return unsubscribe
   }

   values() {
      return this.menuItem
   }

   isValid() {
      const { id, name, price, categoryId } = this.values()

      if (!id || !name || !categoryId) return false

      if (id.length !== 13) return false

      if (price < 0) return false

      return true
   }

   modify(values: Partial<Omit<MenuItem, 'id'>>) {
      this.menuItem = R.mergeRight(this.values(), values)
   }

   async save() {
      if (!this.isValid()) throw new Error('One or more of the values is/are not valid')

      const { id } = this.values()
      const docRef = doc(db, MenuItemModel.PATH, id)
      
      await setDoc(docRef, this.values())
   }

   async delete() {
      const { id } = this.values()

      return await deleteDoc(doc(db, MenuItemModel.PATH, id))
   }

   toString() {
      return this.values().name
   }
}
