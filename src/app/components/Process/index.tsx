import './process.css';
import ProcessTile from './components/HackTile';
type Props = {};

const Process = (props: Props) => {
  const taskItems = [
    {
      id: '00',
      title: 'Core Principles behind liquid',
    },
    {
      id: '01',
      title: 'Tensor',
      subtitle:
        'The maximum price for the NFT is fetched using the Tensor API',
      progress:
        '“decentralized antenna” that can read raw data from satellites.',
    },
    
    {
      id: '02',
      title: 'Jupiter',
      subtitle:
        'The best swap price for the selected token is fetched from Jupiter',
      progress:
        '“decentralized antenna” that can read raw data from satellites.',
    },
    {
      id: '03',
      title: 'Tensor',
      subtitle:
        'On accepting the price, the sale Transaction for the same is fetched from Tensor',
      progress:
        '“decentralized antenna” that can read raw data from satellites.',
    },
    {
      id: '04',
      title: 'Jupiter',
      subtitle:
        "A transaction to swap the proceeds for the selected token is fetched from Jupiter's API",
      progress:
        '“decentralized antenna” that can read raw data from satellites.',
    },
    {
      id: '05',
      title: 'Liquid',
      subtitle:
        'Transactions are simulated, sent and confirmed atomically and sequentially',
      progress:
        'decentralized antenna” that can read raw data from satellites.',
    },
  ];

  return (
      <div
        className="flex w-full h-full font-liquid-regular flex-col items-center py-16 liquid-md:mt-0 gap-y-16 liquid-md:gap-y-[270px] px-4 liquid-md:px-10"
      >
        
        <div className="flex flex-col w-full text-center gap-y-10 liquid-md:gap-y-20">
          <p className="text-white text-[24px] py-2 md:hidden">
            How it works
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 w-full liquid-md:flex-row flex-wrap gap-x-12 gap-y-12">
            {taskItems.map((item, id) => (
              <ProcessTile key={id} item={item} />
            ))}
          </div>
        </div>

        
      </div>
  );
};

export default Process;
