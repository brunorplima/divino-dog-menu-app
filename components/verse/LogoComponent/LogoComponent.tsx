import style from './LogoComponent.module.scss'

type PercentType = `${number | ''}${number}%`

interface Props {
   file?: string
   size?: number
   text?: string
   fontSize?: number
   side?: 'left' | 'right' | 'up' | 'down'
   verticalAlign?: PercentType
   horizontalAlign?: PercentType
}

function LogoComponent(props: Props) {
   const { file, size, text, fontSize, side, verticalAlign, horizontalAlign } = props

   const orientation = () => {
      if (text !== undefined) {
         if (side === 'up') return 'grid-rows-2'
         if (side === 'down' || side === 'right' || side === 'left') return 'grid-cols-2'
         else return null
      } else return null
   }

   const link = file === undefined ? 'logoMain.png' : file

   const logoStyle = {
      width: size !== undefined ? `${size}px` : `75px`,
   }

   const textStyle = {
      fontSize: `${fontSize}px`,
      top: verticalAlign,
      left: horizontalAlign,
   }

   return (
      <>
         <div
            className={`${
               side !== 'left' ? style.allGrids : style.leftGrids
            } relative grid ${orientation()} align-middle`}
         >
            <p className={`relative`}>
               <img src={`./assets/logo/${link}`} style={logoStyle} />
            </p>
            {text !== undefined && (
               <p
                  className={`${style[`${side}Center`]} ${style.fitContent} relative`}
                  style={textStyle}
               >
                  {text}
               </p>
            )}
         </div>
      </>
   )
}

export default LogoComponent
