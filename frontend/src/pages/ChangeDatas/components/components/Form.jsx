import axios from "axios";
import { useUser } from "../../../../context";
import Inputs from "./Inputs";

export default function Form({ handleSubmit, handleChange, type }) {
  const { userAddresses } = useUser();
  if (type === "username") {
    return (
      <form onSubmit={handleSubmit} className="form">
        <div className="">
          <Inputs
            type={"text"}
            name={"newUsername"}
            handleChange={handleChange}
            placeholder={"New Username"}
          />

          <Inputs
            type={"password"}
            name={"password"}
            handleChange={handleChange}
            placeholder={"Password"}
          />
        </div>
        <div className="text-center">
          <button type="submit">Change</button>
        </div>
      </form>
    );
  }

  if (type === "email") {
    return (
      <form onSubmit={handleSubmit} className="form">
        <div className="">
          <Inputs
            type={"email"}
            name={"email"}
            handleChange={handleChange}
            placeholder={"Email"}
          />

          <Inputs
            type={"password"}
            name={"password"}
            handleChange={handleChange}
            placeholder={"Password"}
          />
        </div>
        <div className="text-center">
          <button type="submit">Change</button>
        </div>
      </form>
    );
  }

  if (type === "phone") {
    return (
      <form onSubmit={handleSubmit} className="form">
        <div className="">
          <Inputs
            type={"tel"}
            name={"phone"}
            handleChange={handleChange}
            placeholder={"Phone"}
          />

          <Inputs
            type={"password"}
            name={"password"}
            handleChange={handleChange}
            placeholder={"Password"}
          />
        </div>
        <div className="text-center">
          <button type="submit">Change</button>
        </div>
      </form>
    );
  }

  if (type === "address") {
    if (userAddresses !== undefined) {
      return (
        <form onSubmit={handleSubmit} className="form">
          <div className="">
            <Inputs
              type={"text"}
              name={"addressLine"}
              handleChange={handleChange}
              placeholder={"Address line"}
            />
            <Inputs
              type={"text"}
              name={"city"}
              handleChange={handleChange}
              placeholder={"City"}
            />
            <Inputs
              type={"text"}
              name={"state"}
              handleChange={handleChange}
              placeholder={"State"}
            />
            <Inputs
              type={"text"}
              name={"postalCode"}
              handleChange={handleChange}
              placeholder={"Postal Code"}
            />
            <Inputs
              type={"text"}
              name={"country"}
              handleChange={handleChange}
              placeholder={"Country"}
            />
            <Inputs
              type={"password"}
              name={"password"}
              handleChange={handleChange}
              placeholder={"Password"}
            />
          </div>
          <div className="text-center">
            <button type="submit">Change</button>
          </div>
        </form>
      );
    }
    return (
      <form className="form" onSubmit={handleSubmit}>
        <div className="">
          <Inputs
            type={"text"}
            name={"addressLine"}
            handleChange={handleChange}
            placeholder={"Address line"}
          />
          <Inputs
            type={"text"}
            name={"city"}
            handleChange={handleChange}
            placeholder={"City"}
          />
          <Inputs
            type={"text"}
            name={"state"}
            handleChange={handleChange}
            placeholder={"State"}
          />
          <Inputs
            type={"text"}
            name={"postalCode"}
            handleChange={handleChange}
            placeholder={"Postal Code"}
          />
          <Inputs
            type={"text"}
            name={"country"}
            handleChange={handleChange}
            placeholder={"Country"}
          />
        </div>
        <div className="text-center">
          <button type="submit">Add</button>
        </div>
      </form>
    );
  }
}
