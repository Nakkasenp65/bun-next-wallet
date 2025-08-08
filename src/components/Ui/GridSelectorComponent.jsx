export default function GridSelectorComponent({
  label,
  options, // คาดหวัง array of objects: [{ id, name, icon (ReactNode) }]
  value,
  onChange,
  name,
  containerClassName = "",
  itemClassName = "",
  activeItemClassName = "",
  labelClassName = "",
}) {
  const handleSelect = (optionValue) => {
    onChange(optionValue);
  };

  return (
    <div className="w-full">
      {label && <label className={labelClassName}>{label}</label>}
      <div className={`grid ${containerClassName}`}>
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => handleSelect(option.id)}
            className={`flex flex-col items-center justify-center rounded-xl border p-3 transition-all duration-200 focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:outline-none ${itemClassName} ${
              value === option.id ? activeItemClassName : "bg-white"
            }`}
          >
            {/* เปลี่ยนจาก Image มาเป็น div ที่แสดงผลไอคอน */}
            <div
              className={`flex h-12 w-12 items-center justify-center text-4xl text-gray-600 transition-colors duration-200`}
            >
              {option.icon}
            </div>
            <span
              className={`text-[10px] font-medium ${
                value === option.id ? "text-pink-600" : "text-gray-700"
              }`}
            >
              {option.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
