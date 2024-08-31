const MentorTile = ({ title }: { title?: string }): JSX.Element => {
  return (
    <div
      className={`flex flex-col justify-between min-h-[101px] w-full rounded bg-[#1C1C1C]`}
    >
      <div
        className={
          'w-full h-full px-4 flex flex-col justify-center text-center rounded text-white'
        }
      >
        <span className="text-[20px] endcoin-md:text-[24px] self-center">
          {title}
        </span>
      </div>
    </div>
  );
};

export default MentorTile;
