import { inputStyles } from "../../../../assets/themes/themes";

import { useTheme } from "../../../../context";

export default function Inputs({ type, name, handleChange, placeholder }) {
  const { theme } = useTheme();
  return (
    <div className="">
      <input
        type={type}
        name={name}
        className={`${inputStyles[theme]} p-2 m-2`}
        onChange={handleChange}
        placeholder={placeholder}
      />
    </div>
  );
}
