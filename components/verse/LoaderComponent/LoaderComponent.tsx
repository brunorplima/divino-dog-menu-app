import PuffLoader from 'react-spinners/PuffLoader'

interface Props {
   readonly show: boolean
   readonly size?: number
}

const LoaderComponent: React.FC<Props> = ({ show, size = 60 }) => (
   <>
      {show && (
         <div
            className='text-2xl absolute w-screen top-0 left-0 font-bold text-white flex justify-center items-center z-10'
            style={{ background: '#222327', height: 'calc(100vh - 128px)' }}
         >
            <PuffLoader color={'var(--global-primary-color)'} loading={true} size={size} />
         </div>
      )}
   </>
)

export default LoaderComponent
