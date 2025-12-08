import Image from "next/image";

interface RealmeProps {
  className?: string;
  [key: string]: any;
}

export default function Realme({ className, ...props }: RealmeProps) {
  return (
    <div className={`${className}`} {...props}>
      <Image
        width={64}
        height={64}
        alt="image-logo"
        src={"/logos/realme.png"}
      />
    </div>
  );
}
