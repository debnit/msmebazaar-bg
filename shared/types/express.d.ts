import { SessionUser } from "./user";

declare global {
  namespace Express {
    interface Request {
      user?: SessionUser;
      session?: any; // Or use a more specific type if available
    }
  }
}
