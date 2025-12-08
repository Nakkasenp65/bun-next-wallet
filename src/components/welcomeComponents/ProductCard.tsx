import Image from "next/image";

export default function ProductCard({ product }) {
  return (
    <div className="text-bg-dark bg-white drop-shadow-md drop-shadow-black/25">
      {product.imageUrl !== "" && (
        <Image
          alt="product phone image"
          src={product.imageUrl}
          width={200}
          height={200}
          className="h-48 w-32 object-cover drop-shadow-xl drop-shadow-black"
        />
      )}
      {/* <img
        src={product.imageUrl || null}
        alt={product.model}
        style={{ width: "100px", height: "100px", objectFit: "cover" }}
      /> */}
      <h4>{product.model}</h4>
      <p>ราคา: {product.price.toLocaleString()} บาท</p>
      <p>ราคาดาวน์: {product.downPaymentAmount.toLocaleString()} บาท</p>
    </div>
  );
}
