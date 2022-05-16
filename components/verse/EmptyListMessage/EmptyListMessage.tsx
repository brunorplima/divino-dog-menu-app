import React from 'react'

const EmptyListMessage = () => {
   return (
      <div className='bg-gray-400 m-auto p-10 rounded-3xl flex justify-center items-center flex-col max-w-fit'>
         <img className='m-0 w-28' src='/empty-folder.png' alt='Lista vazia' />
         <strong className='text-gray-600 mt-4'>Lista vazia!</strong>
      </div>
   )
}

export default EmptyListMessage
