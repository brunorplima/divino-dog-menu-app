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
   blocker?: boolean
   activationList?: string[]
}

function CheckBox(props: Props) {
   const { func, id, name, value, state, reffed, reffer, blocker, activationList } = props

   const checkboxInactivation =
      activationList !== undefined &&
      !activationList.includes(id) &&
      blocker !== undefined &&
      blocker

   return (
      <div
         className={`${styles.checkBoxDiv} ${
            checkboxInactivation ? styles.inactive : ''
         } relative justify-center item-center`}
      >
         <input
            onClick={(event) => {
               func(event)
            }}
            onChange={(event) => {}}
            className='relative block'
            type='checkbox'
            id={id}
            name={id}
            value={value}
            ref={(el) => reffed && reffer && reffer(el, reffed)}
            checked={state}
            data-label={`item-${name.toLowerCase().replace(' ', '-')}`}
         />
      </div>
   )
}

export default CheckBox
