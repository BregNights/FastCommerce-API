import "dotenv/config";
import jwt from "jsonwebtoken";

export function generateToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWTKEY, {
    expiresIn: "1h",
  });
}
