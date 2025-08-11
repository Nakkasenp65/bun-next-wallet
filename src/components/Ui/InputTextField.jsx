export default function InputTextField({
  labelName,
  displayIcon,
  inputName,
  formData,
  setFormData = () => {},
  handleInputChange,
}) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <label className="text-bg-dark mb-2 block text-sm font-bold">
        {labelName}
      </label>
      <div className="relative">
        {displayIcon}
        <input
          type="text"
          name={inputName}
          value={formData.fullname}
          onChange={handleInputChange}
          className="text-bg-dark w-full rounded-xl border border-gray-300 p-4 pl-12 outline-none focus:ring-2 focus:ring-pink-400"
        />
      </div>
    </div>
  );
}
