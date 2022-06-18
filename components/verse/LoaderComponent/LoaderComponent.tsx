import PuffLoader from 'react-spinners/PuffLoader'

interface Props {
   readonly show: boolean
   readonly size?: number
}

const LoaderComponent: React.FC<Props> = ({ show, size = 60 }) => (
   <>
      {show && (
         <div
            className='text-2xl absolute w-screen top-0 left-0 font-bold text-white flex justify-center items-center h-screen z-10'
            style={{ background: '#222327' }}
         >
            <PuffLoader color={'#29fd53'} loading={true} size={size} />
         </div>
      )}
   </>
)

export default LoaderComponent
