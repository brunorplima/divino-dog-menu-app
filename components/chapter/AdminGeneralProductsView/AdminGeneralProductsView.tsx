import React from 'react'
import { BiEditAlt } from 'react-icons/bi'
import { MdDeleteOutline } from 'react-icons/md'
import FlavorModel from '../../../models/FlavorModel'
import SauceModel from '../../../models/SauceModel'
import ToppingModel from '../../../models/ToppingModel'
import { priceToString } from '../../../utils/dataHelper'
import ModelStandardFieldInfo from '../../verse/ModelStandardFieldInfo'
import PrimaryButton from '../../verse/PrimaryButton'

interface Props {
   readonly item: ToppingModel | SauceModel | FlavorModel
   readonly setEditMode: (isEdit: boolean) => void
}

const AdminGeneralProductsView: React.FC<Props> = ({ item, setEditMode }) => {
  return (
      <div className='text-white'>
         <div className='flex gap-3 mb-6'>
            <PrimaryButton
               label='Editar'
               icon={BiEditAlt}
               clickHandler={() => setEditMode(true)}
            />
            <PrimaryButton
               label='Deletar'
               icon={MdDeleteOutline}
               clickHandler={setEditMode}
            />
         </div>
         <h2 className='text-xl text-green-500 mb-6'>
            Detalhes
         </h2>
         
         <ModelStandardFieldInfo
            label='Ordem de list'
            info={item.price ? priceToString(item.price) : 'Sem preço'}
         />
         <ModelStandardFieldInfo
            label='Em estoque'
            info={item.isAvailable ? 'Sim' : 'Não'}
         />
      </div>
   )
}

export default AdminGeneralProductsView