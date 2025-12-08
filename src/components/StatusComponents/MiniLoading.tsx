import Image from "next/image";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function MiniLoading({ message = "กำลังโหลด..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Image
        className="h-auto w-32 drop-shadow-xl drop-shadow-black/50"
        alt="pig loading icon"
        src="/videos/pigIcon.gif"
        width={150}
        height={150}
      />
      <div className="flex items-center justify-center gap-2">
        <span className="text-lg font-bold">{message}</span>
        <AiOutlineLoading3Quarters className="text-primary-pink h-5 w-auto animate-spin" />
      </div>
    </div>
  );
}
