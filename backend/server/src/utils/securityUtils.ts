import { createHash } from "crypto";

class SecurityUtils {
  hashPassword(password: string): string {
    return createHash("sha256").update(password).digest("hex");
  }
}

export default SecurityUtils;
