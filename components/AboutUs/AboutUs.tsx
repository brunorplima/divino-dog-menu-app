import Link from 'next/link'
import { useContext } from 'react'
import { settingsContext } from '../contexts/SettingsProvider'
import LogoComponent from '../verse/LogoComponent/LogoComponent'
import style from './AboutUs.module.scss'

function AboutUs() {
   const { settingsModel } = useContext(settingsContext)

   const backImageFileName = 'hot-dog-divino-dog.JPG'

   const ownerLucas = 'lucas.jpg'
   const ownerVitor = 'vitor.jpg'

   return (
      <div className={`${style.allDiv} h-screen text-lg`}>
         <div className={`${style.firstDiv} absolute top-0 w-full`}>
            <img className={`${style.image}`} src={`/assets/img/${backImageFileName}`} />
         </div>
         <div className={`${style.secondDiv} absolute top-0 w-full h-screen`}></div>
         <div className={`${style.thirdDiv} relative font-semibold my-4 mx-6`}>
            {settingsModel && (
               <>
                  <div>
                     <LogoComponent
                        text='Divino Dog'
                        side='right'
                        fontSize={20}
                        verticalAlign='32.5%'
                     />
                  </div>
                  <br />
                  <p className={`${style.yellowTitle}`}>About Us</p>
                  <br />
                  <div className={`${style.company} whitespace-pre-wrap mb-32`}>
                     <p>{settingsModel.aboutUsContent}</p>
                     <div>
                        <span>
                           <img
                              src={`./assets/owners/${ownerLucas}`}
                              className={`${style.faceImage}`}
                           />
                        </span>
                        <span>
                           <img
                              src={`./assets/owners/${ownerVitor}`}
                              className={`${style.faceImage}`}
                           />
                        </span>
                        <span>Lucas</span>
                        <span>Vitor</span>
                     </div>
                  </div>
               </>
            )}
            <p className={`${style.yellowTitle}`}>Nossos desenvolvedores</p>
            <br />
            <div className={`${style.developers} grid grid-cols-1 gap-6`}>
               <div>
                  <img src='./assets/developers/bruno.jpg' className={`${style.faceImage}`} />
                  <p>
                     Bruno is a fullstack developer with experience in developing web applications.
                     He works with HTML, CSS, Typescript and React in the frontend and Ruby on Rails
                     in the backend.&nbsp;
                     <Link href='https://brunolima.vercel.app/'>
                        <a target='_blank'>You can find him online</a>
                     </Link>
                     .
                  </p>
               </div>
               <div>
                  <img src='./assets/developers/eric.jpg' className={`${style.faceImage}`} />
                  <p>
                     Eric is a frontend developer with knowledge in SEO, Business Intelligence,
                     Google Ads, Facebook Ads and Python. He likes hot dog a lot.&nbsp;
                     <Link href='https://ericlima.com.br/'>
                        <a target='_blank'>You can find him online</a>
                     </Link>
                     .
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
