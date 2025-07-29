import { useState } from "react";
import SlideToConfirm from "../Ui/SlideToConfirm";
import { IoIosArrowBack } from "react-icons/io";
import DisposeFramerDiv from "../framerComponents/DisposeFramerDiv";

export default function ConfirmDepositPage({
  showConfirmDepositPage,
  setShowConfirmDepositPage,
  onConfirm,
}) {
  const [confirm, setConfirm] = useState(false);

  const handleSliderComplete = () => {
    onConfirm();
  };

  return (
    <DisposeFramerDiv
      isOpen={showConfirmDepositPage}
      className={
        "fixed z-30 flex h-dvh w-full flex-col items-center justify-center bg-black/75 backdrop-blur-xl"
      }
    >
      <div className="relative mx-auto flex h-60 w-max flex-col items-center justify-center gap-8 rounded-3xl bg-white p-4 text-black">
        <IoIosArrowBack
          className="text-bg-dark absolute top-4 left-4 cursor-pointer"
          size={32}
          onClick={() => setShowConfirmDepositPage(false)}
        />

        <p className="absolute top-4 text-lg font-bold">ยืนยันการเติมเงิน</p>

        {/* 3. Pass the handler to the SlideToConfirm component */}
        <SlideToConfirm onConfirm={handleSliderComplete} />
      </div>
    </DisposeFramerDiv>
  );
}
