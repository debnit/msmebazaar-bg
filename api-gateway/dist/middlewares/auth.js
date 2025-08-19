"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwt = verifyJwt;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
function verifyJwt(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ success: false, message: "Missing token" });
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, config_1.Config.jwtSecret);
        req.user = payload;
        next();
    }
    catch {
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
}
//# sourceMappingURL=auth.js.map