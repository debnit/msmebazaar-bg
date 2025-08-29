import { SessionUser } from "@msmebazaar/types/user";

declare global {
  namespace Express {
    interface Request {
      user?: SessionUser;
      correlationId?: string;
      startTime?: number;
    }
  }
}
