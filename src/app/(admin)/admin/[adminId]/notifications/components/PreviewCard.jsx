import { Bell, Gift } from "lucide-react";
import WalletIcon from "./WalletIcon";
import TypeBadge from "./TypeBadge";

const NotificationType = {
  WALLET: "WALLET",
  REWARD: "REWARD",
  SYSTEM: "SYSTEM",
};

export default function PreviewCard({ title, body, type }) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
      <div className="mb-2 flex items-center gap-2 text-slate-400">
        {type === NotificationType.REWARD ? (
          <Gift className="h-4 w-4" />
        ) : type === NotificationType.WALLET ? (
          <WalletIcon />
        ) : (
          <Bell className="h-4 w-4" />
        )}
        <span className="text-xs">ตัวอย่างการแสดงผล</span>
      </div>
      <div className="flex items-start gap-3">
        <div className="mt-1 h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-br from-pink-100 to-orange-100"></div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="truncate font-semibold text-slate-900">
              {title || "(ไม่มีชื่อเรื่อง)"}
            </div>
            <TypeBadge type={type} />
          </div>
          <div className="mt-0.5 text-sm break-words whitespace-pre-wrap text-slate-700">
            {body || "(ไม่มีเนื้อหา)"}
          </div>
        </div>
      </div>
    </div>
  );
}
