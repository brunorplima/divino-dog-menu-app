import * as R from 'ramda'
import { db } from '../firebase/app'
import { collection, deleteDoc, doc, getDoc, onSnapshot, query, Query, setDoc, Unsubscribe } from "firebase/firestore";
import Model from './Model';
import { Flavor } from './interfaces';
import { generateID } from '../utils/modelHelper';

   export default class FlavorModel extends Model<Flavor> {

      private flavor: Flavor

      constructor(flavor: Omit<Flavor, 'id'> | Flavor) {
         super()
         if (R.propOr(false, 'id', flavor)) this.flavor = flavor as Flavor
         else {
            this.flavor = {
               id: generateID(),
               ...flavor
            }
         }
      }
      
      static get PATH(): string { return 'flavors' }

      static async find(id: string) {
         const docRef = await getDoc(doc(db, FlavorModel.PATH, id))
         
         if (!docRef.exists()) return null

         const flavorModel = new FlavorModel(docRef.data() as Flavor)

         return flavorModel
      }

      static listenToAll(setFunction: Function): Unsubscribe {
         const q = query(collection(db, FlavorModel.PATH))
         
         const unsubscribe = onSnapshot(q, snapshot => {
            const flavors: FlavorModel[] = []
            snapshot.forEach(document => {
               const flavorModel = new FlavorModel(document.data() as Flavor)
               flavors.push(flavorModel)
            })
            setFunction(flavors)
         })
         
         return unsubscribe
      }

      static listenToQuery(q: Query, setFunction: Function): Unsubscribe {
         const unsubscribe = onSnapshot(q, snapshot => {
            const flavors: FlavorModel[] = []
            snapshot.forEach(document => {
               const flavorModel = new FlavorModel(document.data() as Flavor)
               flavors.push(flavorModel)
            })
            setFunction(flavors)
         })
         
         return unsubscribe
      }

      get id()          { return this.flavor.id }
      get name()        { return this.flavor.name }
      get price()       { return this.flavor.price }
      get isAvailable() { return this.flavor.isAvailable }

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
   