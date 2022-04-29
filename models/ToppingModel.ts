import * as R from 'ramda'
import { db } from '../firebase/app'
import { collection, deleteDoc, doc, getDoc, onSnapshot, query, Query, setDoc, Unsubscribe } from "firebase/firestore";
import Model from './Model';
import { Topping } from './interfaces';

export default class ToppingModel extends Model<Topping> {

   constructor(private topping: Topping) {
      super()
   }
   
   static get PATH(): string { return 'toppings' }

   static async find(id: string) {
      const docRef = await getDoc(doc(db, ToppingModel.PATH, id))
      
      if (!docRef.exists()) return null

      const toppingModel = new ToppingModel(docRef.data() as Topping)

      return toppingModel
   }

   static listenToAll(setFunction: Function): Unsubscribe {
      const q = query(collection(db, ToppingModel.PATH))
      
      const unsubscribe = onSnapshot(q, snapshot => {
         const toppings: ToppingModel[] = []
         snapshot.forEach(document => {
            const toppingModel = new ToppingModel(document.data() as Topping)
            toppings.push(toppingModel)
         })
         setFunction(toppings)
      })
      
      return unsubscribe
   }

   static listenToQuery(q: Query, setFunction: Function): Unsubscribe {
      const unsubscribe = onSnapshot(q, snapshot => {
         const toppings: ToppingModel[] = []
         snapshot.forEach(document => {
            const toppingModel = new ToppingModel(document.data() as Topping)
            toppings.push(toppingModel)
         })
         setFunction(toppings)
      })
      
      return unsubscribe
   }

   get id()          { return this.topping.id }
   get name()        { return this.topping.name }
   get price()       { return this.topping.price }
   get isAvailable() { return this.topping.isAvailable }

   values() {
      return this.topping
   }

   isValid() {
      const { id, name, price } = this.values()

      if (id.length !== 13) return false

      if (!name) return false

      if (price && price < 0) return false

      return true
   }

   modify(values: Partial<Omit<Topping, 'id'>>) {
      this.topping = R.mergeRight(this.values(), values)
   }

   async save() {
      if (!this.isValid()) throw new Error('One or more of the values is/are not valid')

      const { id } = this.values()
      
      const docRef = doc(db, ToppingModel.PATH, id)
      
      await setDoc(docRef, this.values())
   }

   async delete() {
      const { id } = this.values()

      return await deleteDoc(doc(db, ToppingModel.PATH, id))
   }

   toString() {
      return this.values().name
   }
}
