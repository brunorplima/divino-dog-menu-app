import React from 'react'
import ReactModal from 'react-modal'
import PrimaryButton from '../../verse/PrimaryButton'

interface DialogFooter {
   readonly label: string
   readonly onClick: () => any
}

interface Props {
   readonly id: string
   readonly isOpen: boolean
   readonly onClose?: () => void
   readonly footer?: DialogFooter[]
   readonly children?: React.ReactNode
}

const Dialog: React.FC<Props> = ({
   id,
   isOpen,
   onClose = () => {},
   footer,
   children
}) => {
   return (
      <ReactModal
         isOpen={isOpen}
         appElement={typeof document !== 'undefined' ? document.getElementById(id) as HTMLElement : undefined}
         ariaHideApp={false}
         className={`h-screen max-w-2xl mr-auto ml-auto overflow-scroll grid place-items-center text-gray-300`}
         onRequestClose={onClose}
         shouldCloseOnOverlayClick
      >
         <div className='max-w-lg bg-gray-600 border-2 border-gray-200 opacity-100 mx-9 rounded'>
            <div className='p-5'>
               {children}
            </div>

            {footer && (
               <div className='p-5 flex justify-end gap-2 pt-0'>
                  {footer.map(element => (
                     <PrimaryButton
                        label={element.label}
                        clickHandler={element.onClick}
                     />
                  ))}
               </div>
            )}
         </div>
      </ReactModal>
   )
}

export default Dialog
