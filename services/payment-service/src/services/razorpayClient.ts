import Razorpay from "razorpay";
import { env } from "../config/env";

const razorpayClient = new Razorpay({
  key_id: env.razorpay.keyId,
  key_secret: env.razorpay.keySecret,

});
//const isValid = (razorpayClient as any).utils.verifyWebhookSignature(...);



export default razorpayClient;
