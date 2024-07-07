import { useTheme } from "../../context/index";

import { useSearchParams } from "react-router-dom";
import { inputStyles, pagesVariant } from "../../assets/themes/themes";
import { EmailForm, PhoneForm, UsernameForm } from "./components/components";
import AddressForm from "./components/AddressForm";

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
  if (dataToChange === "email") {
    return (
      <div
        className={`${pagesVariant[theme]} h-screen p-2 flex justify-center items-center`}
      >
        <EmailForm />
      </div>
    );
  }
  if (dataToChange === "phone") {
    return (
      <div
        className={`${pagesVariant[theme]} h-screen p-2 flex justify-center items-center`}
      >
        <PhoneForm />
      </div>
    );
  }

  if (dataToChange === "address") {
    return (
      <div
        className={`${pagesVariant[theme]} h-screen p-2 flex justify-center items-center`}
      >
        <AddressForm />
      </div>
    );
  } else {
    return (
      <div
        className={`${pagesVariant[theme]} h-screen p-2 flex justify-center items-center text-3xl`}
      >
        <h1>Bad Querry</h1>
      </div>
    );
  }
}
