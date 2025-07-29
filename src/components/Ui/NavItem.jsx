import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import Link from "next/link";

export default function NavItem({ icon, label, isActive, onClick, url }) {
  return (
    <Link
      href={url}
      onClick={onClick}
      className={clsx(
        "group relative flex flex-1 cursor-pointer flex-col items-center gap-1 pt-1 transition-colors",
        isActive
          ? "text-primary-pink"
          : "hover:text-primary-pink text-gray-500",
      )}
    >
      <FontAwesomeIcon
        icon={icon}
        id="nav-icon"
        className={clsx(
          "text-xl transition-transform",
          isActive
            ? "nav-icon drop-shadow-primary-pink -translate-y-1 drop-shadow-xl/50"
            : "hover:shadow-neon-pink group-hover:-translate-y-1",
        )}
      />
      <span className="text-[10px] font-bold">{label}</span>
      {isActive && (
        <div className="bg-primary-pink absolute -bottom-2 h-1.5 w-1.5 rounded-full" />
      )}
    </Link>
  );
}
