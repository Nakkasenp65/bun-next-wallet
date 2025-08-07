import Image from "next/image";

export default function Realme({ className, ...props }) {
  return (
    <div className={`${className}`} props>
      <Image
        width={64}
        height={64}
        alt="image-logo"
        src={"/logos/realme.png"}
      />
    </div>
  );
}
