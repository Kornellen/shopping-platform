import { useTheme } from "../../context/index";

import { useSearchParams } from "react-router-dom";
import { inputStyles, pagesVariant } from "../../assets/themes/themes";
import UsernameForm from "./components/UsernameForm";

export default function ChangeDatas() {
  const [searchParams] = useSearchParams();
  const dataToChange = searchParams.get("datatochange");
  const { theme } = useTheme();

  if (dataToChange === "username") {
    return (
      <div
        className={`${pagesVariant[theme]} h-screen p-2 flex justify-center items-center`}
      >
        <UsernameForm />
      </div>
    );
  }
}
