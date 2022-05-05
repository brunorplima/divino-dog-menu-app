import * as R from 'ramda'
import { db } from '../firebase/app'
import { collection, deleteDoc, doc, getDoc, onSnapshot, query, Query, setDoc, Unsubscribe } from "firebase/firestore";
import Model from './Model';
import { Sauce } from './interfaces';
import { generateID } from '../utils/modelHelper';

export default class SauceModel extends Model<Sauce> {

   private sauce: Sauce

   constructor(sauce: Omit<Sauce, 'id'> | Sauce) {
      super()
      if (R.propOr(false, 'id', sauce)) this.sauce = sauce as Sauce
      else {
         this.sauce= {
            id: generateID(),
            ...sauce
         }
      }
   }
   
   static get PATH(): string { return 'sauces' }

   static async find(id: string) {
      const docRef = await getDoc(doc(db, SauceModel.PATH, id))
      
      if (!docRef.exists()) return null

      const sauceModel = new SauceModel(docRef.data() as Sauce)

      return sauceModel
   }

   static listenToAll(setFunction: Function): Unsubscribe {
      const q = query(collection(db, SauceModel.PATH))
      
      const unsubscribe = onSnapshot(q, snapshot => {
         const sauces: SauceModel[] = []
         snapshot.forEach(document => {
            const sauceModel = new SauceModel(document.data() as Sauce)
            sauces.push(sauceModel)
         })
         setFunction(sauces)
      })
      
      return unsubscribe
   }

   static listenToQuery(q: Query, setFunction: Function): Unsubscribe {
      const unsubscribe = onSnapshot(q, snapshot => {
         const sauces: SauceModel[] = []
         snapshot.forEach(document => {
            const sauceModel = new SauceModel(document.data() as Sauce)
            sauces.push(sauceModel)
         })
         setFunction(sauces)
      })
      
      return unsubscribe
   }

   get id()          { return this.sauce.id }
   get name()        { return this.sauce.name }
   get price()       { return this.sauce.price }
   get isAvailable() { return this.sauce.isAvailable }

   values() {
      return this.sauce
   }

   isValid() {
      const { id, name, price } = this.values()

      if (id.length !== 13) return false

      if (!name) return false

      if (price && price < 0) return false

      return true
   }

   modify(values: Partial<Omit<Sauce, 'id'>>) {
      this.sauce = R.mergeRight(this.values(), values)
   }

   async save() {
      if (!this.isValid()) throw new Error('One or more of the values is/are not valid')

      const { id } = this.values()
      
      const docRef = doc(db, SauceModel.PATH, id)
      
      await setDoc(docRef, this.values())
   }

   async delete() {
      const { id } = this.values()

      return await deleteDoc(doc(db, SauceModel.PATH, id))
   }

   toString() {
      return this.values().name
   }
}
