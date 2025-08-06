import NotificationPage from "@/components/pages/NotificationPage";
import { clouddebugger } from "googleapis/build/src/apis/clouddebugger";
import { useParams } from "next/navigation";

export default function Page() {
  const param = useParams();
  console.log(param);

  return <div>Hello mission</div>;
}
