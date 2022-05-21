import React from 'react'

interface ModelFieldInfoProps {
   readonly label: string
   readonly info: string | number | React.ReactNode
   readonly col?: boolean
}

const ModelStandardFieldInfo: React.FC<ModelFieldInfoProps> = ({ label, info, col = false }) => {
   return (
      <div className={`border-gray-200 border-2 flex ${col && 'flex-col'} mb-4 rounded`}>
         <div className='bg-white text-gray-700 py-1 px-3 font-bold'>{label}</div>
         <div className={`py-1 px-3 flex-1 ${!col && 'text-right'}`}>{info}</div>
      </div>
   )
}

export default ModelStandardFieldInfo
