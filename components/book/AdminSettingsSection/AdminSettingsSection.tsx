import { head, last } from 'ramda'
import React, { useContext } from 'react'
import { settingsContext } from '../../contexts/SettingsProvider'
import { FIELD_CLASS_NAME } from '../../../constants/formConstants'

const expiryTimes = [
   ['15 minutos', 900],
   ['30 minutos', 1800],
   ['1 hora', 3600],
   ['1 hora e 30 minutos', 5400],
   ['3 horas', 10800],
   ['5 horas', 18000],
   ['10 horas', 36000],
   ['1 dia', 86400],
]

const AdminSettingsSection = () => {
   const { settingsModel } = useContext(settingsContext)

   if (!settingsModel) return null
   return (
      <div className='text-gray-200 mb-14'>
         <div className='grid place-content-center my-4'>
            <h1 className='text-xl'>Configurações</h1>
         </div>

         <div
            className='rounded border-2 border-gray-700 p-3 rounded-tl-none border-t-8 text-sm flex flex-col gap-2'
         >
            <div className='flex justify-between gap-3 my-4 text-gray-200 items-center'>
               <label htmlFor='orderDetailsOpenByDefault' className='flex-1'>
                  <div className='text-lg'>Detalhes de pedidos abertos</div>
                  <div className='text-gray-400'>
                     Manter os detalhes dos pedidos sempre abertos, caso contrário será preciso abri-los manualmente.
                  </div>
               </label>
               <input
                  type='checkbox'
                  name='orderDetailsOpenByDefault'
                  id='orderDetailsOpenByDefault'
                  onChange={ev => {
                     const value = ev.currentTarget.checked
                     try {
                        settingsModel?.modify({
                           orderDetailsOpenByDefault: value
                        })
                        settingsModel?.save()
                     }
                     catch (err: any) {
                        console.log(err.message)
                     }
                  }}
                  checked={settingsModel?.orderDetailsOpenByDefault || false}
               />
            </div>
            
            <div className='flex justify-between gap-3 my-4 text-gray-200 items-center'>
               <label htmlFor='allowUserToAddToppings' className='flex-1'>
                  <div className='text-lg'>Permitir usuário adicionar ingredientes</div>
                  <div className='text-gray-400'>
                     Permite usuário escolher ingredientes de um item para serem adicionados
                  </div>
               </label>
               <input
                  type='checkbox'
                  name='allowUserToAddToppings'
                  id='allowUserToAddToppings'
                  onChange={ev => {
                     const value = ev.currentTarget.checked
                     try {
                        settingsModel?.modify({
                           allowUserToAddToppings: value
                        })
                        settingsModel?.save()
                     }
                     catch (err: any) {
                        console.log(err.message)
                     }
                  }}
                  checked={settingsModel?.allowUserToAddToppings || false}
               />
            </div>

            <div className='flex flex-col gap-3 my-4 text-gray-200 items-center'>
               <label htmlFor='maxAmountOfAddons' className='flex-1'>
                  <div className='text-lg'>Adicionais permitidos</div>
                  <div className='text-gray-400'>
                     A quantidade máxima de ingredientes adicionais que o usuário pode escolher para cada item.
                  </div>
               </label>
               <select
                  className={`${FIELD_CLASS_NAME} w-full`}
                  disabled={!settingsModel?.allowUserToAddToppings}
                  value={settingsModel?.maxAmountOfAddons || 3}
                  onChange={ev => {
                     const maxAmountOfAddons = parseInt(ev.target.value)
                     try {
                        settingsModel?.modify({ maxAmountOfAddons })
                        settingsModel?.save()
                     }
                     catch (err: any) {
                        console.log(err.message)
                     }
                  }}
               >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
               </select>
            </div>

            <div className='flex justify-between gap-3 my-4 text-gray-200 items-center'>
               <label htmlFor='allowUserToRemoveToppings' className='flex-1'>
                  <div className='text-lg'>Permitir usuário remover ingredientes</div>
                  <div className='text-gray-400'>
                     Permite usuário escolher ingredientes de um item para serem removidos
                  </div>
               </label>
               <input
                  type='checkbox'
                  name='allowUserToRemoveToppings'
                  id='allowUserToRemoveToppings'
                  onChange={ev => {
                     const value = ev.currentTarget.checked
                     try {
                        settingsModel?.modify({
                           allowUserToRemoveToppings: value
                        })
                        settingsModel?.save()
                     }
                     catch (err: any) {
                        console.log(err.message)
                     }
                  }}
                  checked={settingsModel?.allowUserToRemoveToppings || false}
               />
            </div>

            <div className='flex flex-col gap-3 my-4 text-gray-200 items-center'>
               <label htmlFor='maxAmountOfAddons' className='flex-1'>
                  <div className='text-lg'>Remoções permitidas</div>
                  <div className='text-gray-400'>
                     A quantidade máxima de remoções de ingredientes que o usuário pode escolher para cada item.
                  </div>
               </label>
               <select
                  className={`${FIELD_CLASS_NAME} w-full`}
                  disabled={!settingsModel?.allowUserToRemoveToppings}
                  value={settingsModel?.maxAmountOfRemoves || 3}
                  onChange={ev => {
                     const maxAmountOfRemoves = parseInt(ev.target.value)
                     try {
                        settingsModel?.modify({ maxAmountOfRemoves })
                        settingsModel?.save()
                     }
                     catch (err: any) {
                        console.log(err.message)
                     }
                  }}
               >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
               </select>
            </div>

            <div className='flex justify-between gap-3 my-4 text-gray-200 items-center'>
               <label htmlFor='allowUserToGiveSpecialInstructions' className='flex-1'>
                  <div className='text-lg'>Permitir detalhes no pedido</div>
                  <div className='text-gray-400'>
                     Permite usuário entrar detalhes para cada item no menu.
                  </div>
               </label>
               <input
                  type='checkbox'
                  name='allowUserToGiveSpecialInstructions'
                  id='allowUserToGiveSpecialInstructions'
                  onChange={ev => {
                     const value = ev.currentTarget.checked
                     try {
                        settingsModel?.modify({
                           allowUserToGiveSpecialInstructions: value
                        })
                        settingsModel?.save()
                     }
                     catch (err: any) {
                        console.log(err.message)
                     }
                  }}
                  checked={settingsModel?.allowUserToGiveSpecialInstructions || false}
               />
            </div>

            {/* <div className='flex flex-col gap-3 my-4 text-gray-200 items-center'>
               <label htmlFor='unconfirmedOrderExpiryTime' className='flex-1'>
                  <div className='text-lg'>Prazo limite de pedidos não confirmados</div>
                  <div className='text-gray-400'>
                     Chegando nesse prazo limite, pedidos que não foram confirmados terão seu status mudado para cancelado.
                  </div>
               </label>
               <select
                  className={`${FIELD_CLASS_NAME} w-full`}
                  value={settingsModel?.unconfirmedOrderExpiryTime || last(expiryTimes[2])}
                  onChange={ev => {
                     const unconfirmedOrderExpiryTime = parseInt(ev.target.value)
                     try {
                        settingsModel?.modify({ unconfirmedOrderExpiryTime })
                        settingsModel?.save()
                     }
                     catch (err: any) {
                        console.log(err.message)
                     }
                  }}
               >
                  {expiryTimes.map((opt, idx) => (
                     <option
                        key={JSON.stringify(opt) + idx}
                        value={last(opt)}
                     >
                        {head(opt)}
                     </option>
                  ))}
               </select>
            </div> */}

            <div className='flex flex-col gap-3 my-4 text-gray-200'>
               <label htmlFor='aboutUsContent' className='flex-1 '>
                  <div className='text-lg'>Conteúdo da página Sobre Nós</div>
               </label>
               <textarea
                  className={`${FIELD_CLASS_NAME} w-full h-40 text-base`}
                  name='aboutUsContent'
                  id='aboutUsContent'
                  value={settingsModel?.aboutUsContent || ''}
                  onChange={ev => {
                     const value = ev.currentTarget.value
                     try {
                        settingsModel?.modify({
                           aboutUsContent: value
                        })
                        settingsModel?.save()
                     }
                     catch (err: any) {
                        console.log(err.message)
                     }
                  }}
               ></textarea>
            </div>
         </div>
      </div>
   )
}

export default AdminSettingsSection
