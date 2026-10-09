import { LuPhoneCall } from "react-icons/lu";
import { TiMail } from "react-icons/ti";
import { FaTelegramPlane } from "react-icons/fa";
import ReachOut from '../components/reach-out';
import ContactForm from '../components/contact-form';

const contactData = [
  {
    icon: LuPhoneCall,
    title: 'Have any question?',
    type: '+91 8322667763'
  },
  {
    icon: TiMail,
    title: 'Write email',
    type: 'needhelp@needleon.com'
  },
  {
    icon: FaTelegramPlane,
    title: 'Visit anytime',
    type: '07 pune maharashtra, India'
  }
]
const GetInTouch = () => {
 return (
    <div className="flex mt-12 dark:bg-white/1 bg-stone-100/80 py-20 justify-center">
      <div className='grid max-w-245 gap-x-8 flex-1 grid-cols-2 max-sm:grid-cols-1 max-lg:px-4 max-sm:gap-y-20'>
        <div>
          <div className='mb-8'>
            <p className='text-xs dark:text-white/60 text-stone-950/60'>SEND US EMAIL</p>
            <h1 className='text-4xl text-gray-900 dark:text-white font-garamond font-semibold mt-2'>Feel free to write</h1>
          </div>
          <ContactForm />
        </div>

        <div className="text-xs flex flex-col gap-y-2">
            <p className='text-xs text-stone-950/60 dark:text-white/60'>NEED ANY HELP</p>
            <h2 className='text-4xl text-gray-900 font-garamond font-semibold dark:text-white'>Get in touch with us</h2>
            <p className="my-4 text-stone-950/70 dark:text-white/70">Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio ipsa ipsum porro quam, illum asperiores suscipit voluptate iusto. istinctio ipsa ipsum porro quam, illum istinctio ipsa ipsum porro quam, illum</p>

            {
              contactData.map((data, index) => (
                <ReachOut key={index} {...data} />
              ))
            }
        </div>
      </div>
    </div>
  )
}

export default GetInTouch


