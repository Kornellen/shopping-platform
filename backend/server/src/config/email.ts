import { config } from "dotenv";

config();

type email = {
  service: string;
  auth: {
    user: string;
    pass: string;
  };
};

const email = {
  service: "gmail",
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
};

export default email;
