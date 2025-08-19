import { SessionUser } from "../../shared/auth";  // adjust relative path as needed

declare global {
  namespace Express {
    interface Request {
      user?: SessionUser;
    }
  }
}
