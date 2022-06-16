import Link from 'next/link'
import { useContext } from 'react'
import { settingsContext } from '../contexts/SettingsProvider'
import LogoComponent from '../verse/LogoComponent/LogoComponent'
import style from './AboutUs.module.scss'

function AboutUs() {
   const { settingsModel } = useContext(settingsContext)

   const backImageFileName = 'hotdog-with-ketchup-mustard-lettuce-wooden-surface.jpg'

   const text = settingsModel ? settingsModel.aboutUsContent.split('\\n') : ['']

   return (
      <div className={`${style.allDiv} h-screen text-lg`}>
         <div className={`${style.firstDiv} absolute top-0 w-full`}>
            <img className={`${style.image}`} src={`/assets/img/${backImageFileName}`} />
         </div>
         <div className={`${style.secondDiv} absolute top-0 w-full h-screen`}></div>
         <div className={`${style.thirdDiv} relative font-semibold my-4 mx-6`}>
            {settingsModel && (
               <>
                  <p>
                     <LogoComponent
                        text='Divino Dog'
                        side='right'
                        fontSize={20}
                        verticalAlign='32.5%'
                     />
                  </p>
                  <br />
                  <p className={`${style.greenTitle}`}>Quem somos nós</p>
                  <br />
                  {text.map((t) => (
                     <>
                        <p>{t}</p>
                        <br />
                     </>
                  ))}
               </>
            )}
            <p className={`${style.greenTitle}`}>Nossos desenvolvedores</p>
            <br />
            <div className={`${style.developers} grid grid-cols-1 gap-6`}>
               <div>
                  <img src='./assets/developers/bruno.jpg' className={`${style.faceImage}`} />
                  <p>
                     Bruno é um programador fullstack muito experiente. Socialista convicto e
                     cristão reformado, reside na terra do pé grande, o Canadá. Apoiou as políticas
                     de Trudeau durante a pandemia e tomou 7 doses de vacinas de diferentes marcas
                     só por precaução: &quot;Vai que a gente pega isso daí e vira
                     borboleta!?&quot;&nbsp;
                     <Link href='https://brunoreactdeveloper.web.app/'>
                        <a target='_blank'>Você também pode me encontrar online</a>
                     </Link>
                     .
                  </p>
               </div>
               <div>
                  <img src='./assets/developers/eric.jpg' className={`${style.faceImage}`} />
                  <p>
                     Eric é um desenvolvedor frontend e um cristão reformado convicto. Possuidor de
                     conhecimentos sobre marketing, economia, estatística, história e política é um
                     liberal clássico. Gosta muito de hot dog.
                  </p>
               </div>
            </div>
         </div>
         <br />
         <br />
         <br />
      </div>
   )
}

export default AboutUs
