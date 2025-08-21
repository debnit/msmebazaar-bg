"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRazorpayOrderController = createRazorpayOrderController;
exports.razorpayWebhookController = razorpayWebhookController;
const crypto_1 = __importDefault(require("crypto"));
const paymentService = __importStar(require("../services/payment.service"));
const helper_1 = require("../utils/helper");
const env_1 = require("../config/env");
async function createRazorpayOrderController(req, res) {
    const userId = (0, helper_1.getUserIdFromReq)(req);
    const { amount } = req.body;
    if (!amount || typeof amount !== "number" || amount <= 0) {
        return res.status(400).json({ error: "Invalid amount" });
    }
    try {
        const { order, paymentRecord } = await paymentService.createRazorpayOrder(userId, amount * 100); // convert to paise
        res.status(201).json({ order, paymentRecord });
    }
    catch (error) {
        console.error("Error creating Razorpay order", error);
        res.status(500).json({ error: "Could not create payment order" });
    }
}
const validateRazorpayWebhook = (req) => {
    const secret = env_1.env.RAZORPAY_KEY_SECRET;
    const shasum = crypto_1.default.createHmac("sha256", secret);
    const body = JSON.stringify(req.body);
    shasum.update(body);
    const digest = shasum.digest("hex");
    return digest === req.headers["x-razorpay-signature"];
};
async function razorpayWebhookController(req, res) {
    if (!validateRazorpayWebhook(req)) {
        return res.status(400).json({ error: "Invalid signature" });
    }
    const event = req.body.event;
    const payload = req.body.payload;
    if (event === "payment.captured") {
        const paymentEntity = payload.payment.entity;
        // Update payment status as captured/paid
        await paymentService.updatePaymentStatus(paymentEntity.order_id, "completed", paymentEntity.id);
        return res.status(200).json({ status: "ok" });
    }
    // Handle other events as needed
    return res.status(200).json({ status: "ignored" });
}
//# sourceMappingURL=payment.controller.js.map