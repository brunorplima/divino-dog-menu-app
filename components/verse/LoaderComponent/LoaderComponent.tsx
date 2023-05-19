import PuffLoader from 'react-spinners/PuffLoader'
import { GLOBAL_PRIMARY_COLOR } from '../../../constants/cssConstants'

interface Props {
   readonly show: boolean
   readonly size?: number
}

const LoaderComponent: React.FC<Props> = ({ show, size = 60 }) => (
   <>
      {show && (
         <div
            className='text-2xl absolute w-full top-0 left-0 bottom-0 font-bold text-white flex justify-center items-center z-30'
            style={{ background: '#222327' }}
         >
            <PuffLoader color={GLOBAL_PRIMARY_COLOR} loading={true} size={size} />
         </div>
      )}
   </>
)

export default LoaderComponent
