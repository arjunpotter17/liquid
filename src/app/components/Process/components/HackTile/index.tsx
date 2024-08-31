import React from 'react';
import './processTile.css';

const ProcessTile = ({
  item,
}: {
  item: any;
}): JSX.Element => {

  return (
    <div
      className={`card font-liquid-regular flex flex-col justify-between min-h-[230px] w-full h-full text-left rounded ${
        item.id === '00' ? 'hidden md:block' : 'bg-[#1C1C1C] shadow-card'
      }`}
    >
      <div
        className={`w-full h-full max-h-fit px-[30px] flex flex-col justify-start rounded text-white ${
          item.id === '00' ? 'px-0 font-liquid-bold justify-center' : ''
        }`}
      >
        <div className="flex items-start gap-x-2">
          <span className="text-[64px] text-[#7D95E2] font-liquid-bold">
            {item.id === '00' ? '' : item.id}
          </span>
          <span className={`text-[24px] liquid-md:text-[36px] self-center `}>
            {item.title}
          </span>
        </div>
        <p className="text-[14px] liquid-md:text-[17px]">
          {item.subtitle}
        </p>
      </div>
      {/* <div
        className={`w-full h-full max-h-fit px-[30px] flex flex-col justify-start rounded text-white ${
          item.id === '00' ? 'px-0 font-endcoin-bold justify-center' : ''
        }`}
      >
        <div className="flex items-start gap-x-2">
          <span className="text-[64px] text-[#7D95E2] font-bold">
            {item.id === '00' ? '' : item.id}
          </span>
          <span className={`text-[24px] endcoin-md:text-[36px] self-center `}>
            {item.title}
          </span>
        </div>
        <p className="text-[14px] endcoin-md:text-[17px]">{item.subtitle}</p>
      </div> */}
    </div>
  );
};

export default ProcessTile;
