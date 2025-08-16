const fs = require("fs");
const path = require("path");

const schemasDir = path.resolve(__dirname, "../shared/validation");

const microservices = [
  "auth",
  "loan",
  "msme",
  "notification",
  "compliance",
  "recommendation",
  "matchmaking",
  "valuation",
  "searchMatchmaking",
  "transactionMatching",
  "mlMonitoring",
  "payment",
  "agent",
  "buyer",
  "seller",
  "admin",
  "superAdmin"
];

function toPascalCase(str) {
  return str.replace(/(^\w|-\w)/g, (match) => match.replace("-", "").toUpperCase());
}

microservices.forEach((service) => {
  const schemaName = `${toPascalCase(service)}Schema`;
  const filePath = path.join(schemasDir, `${service}.schema.ts`);
  if (fs.existsSync(filePath)) {
    console.log(`Skipping existing file: ${filePath}`);
    return;
  }

  const template = `import { z } from "zod";

export const ${schemaName} = z.object({
  // TODO: Define fields here
  exampleField: z.string().min(1)
});

`;

  fs.writeFileSync(filePath, template, { encoding: "utf8" });
  console.log(`Created schema: ${filePath}`);
});
