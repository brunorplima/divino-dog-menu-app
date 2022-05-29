import { MenuItem } from './interfaces'
import * as R from 'ramda'
import { db } from '../firebase/app'
import { collection, deleteDoc, doc, getDoc, onSnapshot, query, Query, setDoc, Unsubscribe } from "firebase/firestore";
import Model from './Model';
import { generateID } from '../utils/modelHelper';

export default class MenuItemModel extends Model<MenuItem> {

   private menuItem: MenuItem

   constructor(item: Omit<MenuItem, 'id'> | MenuItem) {
      super()
      if (R.propOr(false, 'id', item)) this.menuItem = item as MenuItem
      else {
         this.menuItem = {
            id: generateID(),
            ...item
         }
      }
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

      const menuItemModel = new MenuItemModel(docRef.data() as MenuItem)

      return menuItemModel
   }

   /**
    * Opens a real time connection with the collection in the databse.
    * @param setFunction - The function to set external state to values return from collection
    * @returns A function returned by firestore's ```onSnapshot()``` that removes the listener when invoked.
    */
   static listenToAll(setFunction: Function): Unsubscribe {
      const q = query(collection(db, MenuItemModel.PATH))
      
      const unsubscribe = onSnapshot(q, snapshot => {
         const menuItems: MenuItemModel[] = []
         snapshot.forEach(document => {
            const menuItem = document.data()
            if (menuItem.promoPrice && menuItem.promoPrice.dateLimit) {
               menuItem.promoPrice.dateLimit = menuItem.promoPrice.dateLimit.toDate()
            }
            const menuItemModel = new MenuItemModel(menuItem as MenuItem)
            menuItems.push(menuItemModel)
         })
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
         const menuItems: MenuItemModel[] = []
         snapshot.forEach(document => {
            const menuItem = document.data()
            if (menuItem.promoPrice && menuItem.promoPrice.dateLimit) {
               menuItem.promoPrice.dateLimit = menuItem.promoPrice.dateLimit.toDate()
            }
            const menuItemModel = new MenuItemModel(menuItem as MenuItem)
            menuItems.push(menuItemModel)
         })
         setFunction(menuItems)
      })
      
      return unsubscribe
   }

   get id()          { return this.menuItem.id }
   get name()        { return this.menuItem.name }
   get price()       { return this.menuItem.price }
   get isAvailable() { return this.menuItem.isAvailable }
   get categoryId()  { return this.menuItem.categoryId }
   get optionIds()   { return this.menuItem.optionIds }
   get toppingIds()  { return this.menuItem.toppingIds }
   get sauceIds()    { return this.menuItem.sauceIds }
   get description() { return this.menuItem.description }
   get listOrder()   { return this.menuItem.listOrder }
   get img()         { return this.menuItem.img }
   get promoPrice()  { return this.menuItem.promoPrice }

   hasPromo() {
      return this.hasValidPromo() && this.promoPrice
   }

   hasValidPromo() {
      if (this.promoPrice && this.promoPrice.dateLimit && this.promoPrice.price) return true
      else if (!this.promoPrice) return true
      else return false
   }

   values() {
      return this.menuItem
   }

   isValid() {

      if (!this.id || !this.name || !this.categoryId) return false

      if (this.id.length !== 13) return false

      if (this.price < 0) return false

      if (this.img && typeof this.img !== 'string') return false

      return true
   }

   modify(values: Partial<Omit<MenuItem, 'id'>>) {
      this.menuItem = R.mergeRight(this.values(), values)
   }

   removeProp(prop: 'optionIds' | 'toppingIds' | 'sauceIds' | 'description' | 'img' | 'promoPrice') {
      this.menuItem = R.dissoc(prop, this.values())
   }

   async save() {
      if (!this.isValid()) throw new Error('One or more of the values is/are not valid')
      const docRef = doc(db, MenuItemModel.PATH, this.id)
      
      await setDoc(docRef, this.values())
   }

   async delete() {
      return await deleteDoc(doc(db, MenuItemModel.PATH, this.id))
   }

   toString() {
      return this.name
   }
}
