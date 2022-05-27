import * as R from 'ramda'
import { db } from '../firebase/app'
import { collection, deleteDoc, doc, getDoc, onSnapshot, query, Query, setDoc, Unsubscribe } from "firebase/firestore";
import Model from './Model';
import { MenuItemOption } from './interfaces';
import { generateID } from '../utils/modelHelper';

   export default class MenuItemOptionModel extends Model<MenuItemOption> {

      private menuItemOption: MenuItemOption

      constructor(option: Omit<MenuItemOption, 'id'> | MenuItemOption) {
         super()
         if (R.propOr(false, 'id', option)) this.menuItemOption = option as MenuItemOption
         else {
            this.menuItemOption = {
               id: generateID(),
               ...option
            }
         }
      }
      
      static get PATH(): string { return 'menuItemOptions' }

      static async find(id: string) {
         const docRef = await getDoc(doc(db, MenuItemOptionModel.PATH, id))
         
         if (!docRef.exists()) return null

         const menuItemOptionModel = new MenuItemOptionModel(docRef.data() as MenuItemOption)

         return menuItemOptionModel
      }

      static listenToAll(setFunction: Function): Unsubscribe {
         const q = query(collection(db, MenuItemOptionModel.PATH))
         
         const unsubscribe = onSnapshot(q, snapshot => {
            const options: MenuItemOptionModel[] = []
            snapshot.forEach(document => {
               const menuItemOptionModel = new MenuItemOptionModel(document.data() as MenuItemOption)
               options.push(menuItemOptionModel)
            })
            setFunction(options)
         })
         
         return unsubscribe
      }

      static listenToQuery(q: Query, setFunction: Function): Unsubscribe {
         const unsubscribe = onSnapshot(q, snapshot => {
            const options: MenuItemOptionModel[] = []
            snapshot.forEach(document => {
               const menuItemOptionModel = new MenuItemOptionModel(document.data() as MenuItemOption)
               options.push(menuItemOptionModel)
            })
            setFunction(options)
         })
         
         return unsubscribe
      }

      get id()          { return this.menuItemOption.id }
      get name()        { return this.menuItemOption.name }
      get price()       { return this.menuItemOption.price }
      get isAvailable() { return this.menuItemOption.isAvailable }

      values() {
         return this.menuItemOption
      }

      isValid() {
         if (this.id.length !== 13) return false

         if (!this.name) return false

         if (this.price && this.price < 0) return false

         return true
      }

      modify(values: Partial<Omit<MenuItemOption, 'id'>>) {
         this.menuItemOption = R.mergeRight(this.values(), values)
      }

      async save() {
         if (!this.isValid()) throw new Error('One or more of the values is/are not valid')
         
         const docRef = doc(db, MenuItemOptionModel.PATH, this.id)
         
         await setDoc(docRef, this.values())
      }

      async delete() {
         return await deleteDoc(doc(db, MenuItemOptionModel.PATH, this.id))
      }

      toString() {
         return this.name
      }
   }
   