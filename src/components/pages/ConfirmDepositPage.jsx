import { useState } from "react";
import SlideToConfirm from "../Ui/SlideToConfirm";
import { IoIosArrowBack } from "react-icons/io";
import DisposeFramerDiv from "../framerComponents/DisposeFramerDiv";

export default function ConfirmDepositPage({ showConfirmDepositPage, setShowConfirmDepositPage, onConfirm }) {
  const [confirm, setConfirm] = useState(false);

  const handleSliderComplete = () => {
    onConfirm();
  };

  return (
    <DisposeFramerDiv
      isOpen={showConfirmDepositPage}
      className={"flex flex-col items-center justify-center backdrop-blur-xl bg-black/75 fixed z-30 w-full h-dvh"}
    >
      <div className="mx-auto relative flex h-60 w-max flex-col items-center justify-center gap-8 rounded-3xl bg-white p-4 text-black">
        <IoIosArrowBack
          className="absolute top-4 left-4 cursor-pointer text-bg-dark"
          size={32}
          onClick={() => setShowConfirmDepositPage(false)}
        />

        <p className="text-lg font-bold absolute top-4">ยืนยันการเติมเงิน</p>

        {/* 3. Pass the handler to the SlideToConfirm component */}
        <SlideToConfirm onConfirm={handleSliderComplete} />
      </div>
    </DisposeFramerDiv>
  );
}
