import { useRouter } from "next/navigation";
import "./about.css";

type Props = {};

const About = (props: Props) => {
  const router = useRouter();
  return (
    <div className="flex flex-col justify-center items-center py-[75px] w-full px-4 liquid-md:px-10">
      <div className="text-white flex flex-col gap-y-6 items-center w-full">
        <p className="text-[30px] text-left liquid-md:text-[40px] liquid-xl:text-[48px] font-liquid-bold text-liquid-white w-full">
          About
        </p>
        <p className="text-[14px] liquid-xl:text-[18px] text-justify font-liquid-regular">
          Liquid is a cutting-edge platform built on the Solana blockchain,
          designed to provide users with unparalleled flexibility in managing
          their digital assets. With Liquid, you can seamlessly liquidate your
          NFTs into any token of your choice, offering a powerful and efficient
          way to unlock the value of your non-fungible tokens. Join Liquid today
          and take control of your NFTs like never before. Experience true
          liquidity with just a few clicks, and explore the endless
          possibilities of your digital assets on the Solana blockchain.
        </p>
        <button
          onClick={() =>
            router.push("/trade")
          }
          className={`rounded border border-liquid-blue text-liquid-blue text-[12px] liquid-md:text-[16px] py-2 px-[14.5px] bg-none hover:bg-liquid-blue hover:text-liquid-black font-liquid-regular self-start`}
        >
          Start Liquidating
        </button>
      </div>
    </div>
  );
};

export default About;
