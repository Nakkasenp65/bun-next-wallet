interface InputTextFieldProps {
  labelName: string;
  displayIcon: React.ReactNode;
  inputName: string;
  formData: any;
  setFormData?: React.Dispatch<React.SetStateAction<any>>;
  handleInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InputTextField({
  labelName,
  displayIcon,
  inputName,
  formData,
  setFormData = () => {},
  handleInputChange: propHandleInputChange,
}: InputTextFieldProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (propHandleInputChange) {
      propHandleInputChange(e);
      return;
    }
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
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
