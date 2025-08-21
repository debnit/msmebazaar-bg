"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPayment = createPayment;
exports.updatePaymentStatus = updatePaymentStatus;
exports.getPaymentById = getPaymentById;
const prismaClient_1 = __importDefault(require("../db/prismaClient"));
async function createPayment(data) {
    return prismaClient_1.default.payment.create({ data });
}
async function updatePaymentStatus(paymentId, status, gatewayRef) {
    return prismaClient_1.default.payment.update({
        where: { id: paymentId },
        data: { status, gatewayRef },
    });
}
async function getPaymentById(paymentId) {
    return prismaClient_1.default.payment.findUnique({ where: { id: paymentId } });
}
//# sourceMappingURL=payment.repository.js.map