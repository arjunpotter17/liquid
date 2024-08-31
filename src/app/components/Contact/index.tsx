import XIcon from '@/app/Icons/xIcon';
import './contact.css';
import Link from 'next/link';

type Props = {};

const Contact = (props: Props) => {
  return (
      <div
        className="flex flex-col justify-center items-start font-liquid-regular w-full gap-y-2 liquid-md:gap-y-4 text-white py-[50px] liquid-md:py-[100px] px-4 liquid-md:px-10"
      >
        <p className="text-[30px] liquid-md:text-[40px] liquid-xl:text-[48px] font-liquid-bold">
          Get in touch
        </p>
        <div className="text-[12px] liquid-md:text-[14px] liquid-xl:text-[18px]">
          <p>We’d love to hear from you, please leave us a message</p>
          <p>or contact us via socials directly!</p>
        </div>

        <div className="flex gap-x-5 justify-center items-center">
          
          <Link
            href="https://twitter.com/arjunpotter17"
            target="_blank"
            rel="noreferrer"
          >
            <XIcon/>
          </Link>
          <Link
            href="https://github.com/arjunpotter17"
            target="_blank"
            rel="noopener noreferrer"
          >
            {/* <img src={github} alt="mail" className="cursor-pointer" /> */}
          </Link>
        </div>
      </div>
  );
};

export default Contact;
