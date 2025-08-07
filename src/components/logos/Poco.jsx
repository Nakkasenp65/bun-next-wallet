import Image from "next/image";

export default function Poco({ className, ...props }) {
  return (
    <div className={`${className}`} props>
      <Image width={64} height={64} alt="image-logo" src={"/logos/poco.png"} />
    </div>
  );
}
