import type { IconType } from "react-icons";

type CardForInformationProps = {
  title: string;
  description: string;
  icon: IconType;
};
export default function CardForInformation({
  title,
  description,
  icon: Icon,
}: CardForInformationProps) {
  return (
    <div className="bg-sky-500 rounded-md transition ease-in-out hover:scale-105 text-white text-center px-2 py-5 hover:shadow-2xl cursor-default hover:border-white hover:border">
      <div className="flex justify-center my-5">
        <Icon size={40} />
      </div>
      <h2 className="font-bold text-2xl my-2">{title}</h2>
      <p className="text-lg">{description}</p>
    </div>
  );
}
