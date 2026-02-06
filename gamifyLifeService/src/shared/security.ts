import crypto from "crypto";

// SHA256加密
export const sha256 = function (data: any) {
  return crypto.createHash("sha256").update(data).digest("hex");
};
