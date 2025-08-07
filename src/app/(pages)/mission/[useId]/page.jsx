"use client";
import { useParams } from "next/navigation";

export default function Page() {
  const param = useParams();
  console.log(param);

  return <div>Hello mission</div>;
}
