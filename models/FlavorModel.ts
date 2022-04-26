import * as R from 'ramda'
import { db } from '../firebase/app'
import { collection, deleteDoc, doc, getDoc, onSnapshot, query, Query, setDoc, Unsubscribe } from "firebase/firestore";
import Model from './Model';
import { Flavor } from './interfaces';

   export default class FlavorModel extends Model<Flavor> {

      constructor(public flavor: Flavor) {
         super()
      }
      
      static get PATH(): string { return 'flavors' }

      static async find(id: string) {
         const docRef = await getDoc(doc(db, FlavorModel.PATH, id))
         
         if (!docRef.exists()) return null

         return docRef.data() as Flavor
      }

      static listenToAll(setFunction: Function): Unsubscribe {
         const q = query(collection(db, FlavorModel.PATH))
         
         const unsubscribe = onSnapshot(q, snapshot => {
            const flavors: Flavor[] = []
            snapshot.forEach(document => flavors.push(document.data() as Flavor))
            setFunction(flavors)
         })
         
         return unsubscribe
      }

      static listenToQuery(q: Query, setFunction: Function): Unsubscribe {
         const unsubscribe = onSnapshot(q, snapshot => {
            const flavors: Flavor[] = []
            snapshot.forEach(document => flavors.push(document.data() as Flavor))
            setFunction(flavors)
         })
         
         return unsubscribe
      }

      values() {
         return this.flavor
      }

      isValid() {
         const { id, name, price } = this.values()

         if (id.length !== 13) return false

         if (!name) return false

         if (price && price < 0) return false

         return true
      }

      modify(values: Partial<Omit<Flavor, 'id'>>) {
         this.flavor = R.mergeRight(this.values(), values)
      }

      async save() {
         if (!this.isValid()) throw new Error('One or more of the values is/are not valid')

         const { id } = this.values()
         
         const docRef = doc(db, FlavorModel.PATH, id)
         
         await setDoc(docRef, this.values())
      }

      async delete() {
         const { id } = this.values()

         return await deleteDoc(doc(db, FlavorModel.PATH, id))
      }

      toString() {
         return this.values().name
      }
   }
   