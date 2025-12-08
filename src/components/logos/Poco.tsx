import Image from "next/image";

interface PocoProps {
  className?: string;
  [key: string]: any;
}

export default function Poco({ className, ...props }: PocoProps) {
  return (
    <div className={`${className}`} {...props}>
      <Image width={64} height={64} alt="image-logo" src={"/logos/poco.png"} />
    </div>
  );
}
