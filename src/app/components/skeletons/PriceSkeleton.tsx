import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './skeleton.css'; // Import the custom CSS file

const PriceSkeleton = (): JSX.Element => {
  return (
    <div className='w-[80px] h-[18px]'>
      <Skeleton 
        baseColor="#7bc6e3" // Use your custom bg-liquid-blue color here
        highlightColor="#4f94ef" // Slightly lighter shade for the shimmer
        width={80}
        height={20}
      />
    </div>
  );
};

export default PriceSkeleton;
