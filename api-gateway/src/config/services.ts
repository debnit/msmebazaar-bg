// List of microservice URLs, loaded from env or config
export const servicesConfig = {
  auth: process.env.AUTH_SERVICE_URL || "http://auth-service:4001",
  analytics: process.env.ANALYTICS_SERVICE_URL || "http://analytics-service:4002",
  marketplace: process.env.MARKETPLACE_SERVICE_URL || "http://marketplace-service:4003",
  payments: process.env.PAYMENTS_SERVICE_URL || "http://payments-service:4004",
  user: process.env.USER_SERVICE_URL || "http://user-service:4005"
  // ...other services
};
