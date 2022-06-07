import * as R from 'ramda'
import { db } from '../firebase/app'
import { deleteDoc, doc, getDoc, onSnapshot, setDoc, Unsubscribe } from 'firebase/firestore'
import Model from './Model'
import { Settings } from './interfaces'

export default class SettingsModel extends Model<Settings> {

   private settings: Settings
   private static instance: SettingsModel

   private constructor(settings: Settings) {
      super()
      this.settings = settings
   }
   
   static get PATH(): string              { return 'settings' }
   static get Instance(): SettingsModel   { return this.instance }

   static async fetch() {
      const docRef = await getDoc(doc(db, SettingsModel.PATH, SettingsModel.PATH))
      
      if (!docRef.exists()) return null

      const menuItemOptionModel = new this(docRef.data() as Settings)

      return menuItemOptionModel
   }

   static listen(setFunction: Function): Unsubscribe {
      const docRef = doc(db, `${this.PATH}/${this.PATH}`)
   
      const unsubscribe = onSnapshot(docRef, async snapshot => {
         const settings = snapshot.data() as Settings
         try {
            if (snapshot.exists()) {
               const model = new SettingsModel(settings)
               model.modify(R.omit(['id'], settings))
               this.instance = model
               setFunction(model)
               model.save()
            }
            else {
               const model = new SettingsModel(initialValues)
               this.instance = model
               setFunction(model)
               model.save()
            }
         }
         catch (err: any) {
            console.log(err.message)
         }
      })
      
      return unsubscribe
   }

   get id()                                  { return this.settings.id }
   get orderDetailsOpenByDefault()           { return this.settings.orderDetailsOpenByDefault }
   get allowUserToAddToppings()              { return this.settings.allowUserToAddToppings }
   get allowUserToRemoveToppings()           { return this.settings.allowUserToRemoveToppings }
   get allowUserToGiveSpecialInstructions()  { return this.settings.allowUserToGiveSpecialInstructions }
   get aboutUsContent()                      { return this.settings.aboutUsContent }
   get unconfirmedOrderExpiryTime()          { return this.settings.unconfirmedOrderExpiryTime }
   get maxAmountOfAddons()                   { return this.settings.maxAmountOfAddons }
   get maxAmountOfRemoves()                   { return this.settings.maxAmountOfRemoves }

   values() {
      return this.settings
   }

   isValid() {
      return Boolean(!R.isNil(this.aboutUsContent)
         && !R.isNil(this.allowUserToAddToppings)
         && !R.isNil(this.allowUserToGiveSpecialInstructions)
         && !R.isNil(this.allowUserToRemoveToppings)
         && !R.isNil(this.unconfirmedOrderExpiryTime)
         && !R.isNil(this.maxAmountOfAddons)
         && !R.isNil(this.orderDetailsOpenByDefault))
   }

   modify(values: Partial<Omit<Settings, 'id'>>) {
      this.settings = R.mergeRight(this.values(), values)
   }

   async save() {
      if (!this.isValid()) throw new Error('One or more values are not valid!')

      const docRef = doc(db, SettingsModel.PATH, this.id)
      
      await setDoc(docRef, this.values())
   }

   async delete() {
      return await deleteDoc(doc(db, SettingsModel.PATH, this.id))
   }

   toString() {
      return 'Settings'
   }
}

const initialValues: Settings = {
   id: SettingsModel.PATH,
   aboutUsContent: '',
   allowUserToAddToppings: false,
   allowUserToGiveSpecialInstructions: false,
   allowUserToRemoveToppings: false,
   maxAmountOfAddons: 1,
   maxAmountOfRemoves: 1,
   orderDetailsOpenByDefault: true,
   unconfirmedOrderExpiryTime: 3600
}
   