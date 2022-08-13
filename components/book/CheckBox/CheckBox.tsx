import React, { MutableRefObject } from 'react'
import styles from './CheckBox.module.scss'

interface Props {
   func: (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => void
   id: string
   name: string
   value: string | number | undefined
   state?: boolean
   reffed?: MutableRefObject<HTMLInputElement[]>
   reffer?: (
      el: HTMLInputElement | null,
      ElementReffed: MutableRefObject<HTMLInputElement[]>
   ) => void
}

function CheckBox(props: Props) {
   const { func, id, name, value, state, reffed, reffer } = props

   return (
      <div className={`${styles.checkBoxDiv} relative justify-center item-center`}>
         <input
            onClick={(event) => {
               func(event)
            }}
            onChange={(event) => {}}
            className='relative block'
            type='checkbox'
            id={id}
            name={name}
            value={value}
            ref={(el) => reffed && reffer && reffer(el, reffed)}
            checked={state}
         />
      </div>
   )
}

export default CheckBox
