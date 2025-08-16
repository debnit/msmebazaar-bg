import { jwtMw } from "@shared/auth";
import { Config } from "../config/env";
export default jwtMw(Config.jwtSecret);
