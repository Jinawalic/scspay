const { PrismaClient } = require("@prisma/client");
const crypto = require("crypto");

const prisma = new PrismaClient();

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derivedKey}`;
}

async function main() {
  const adminPass = hashPassword("12345678");

  console.log("Seeding admins...");

  await prisma.adminAccount.upsert({
    where: { email: "admin@gmail.com" },
    update: {
      passwordHash: adminPass,
    },
    create: {
      email: "admin@gmail.com",
      username: "admin",
      fullName: "Super Admin",
      passwordHash: adminPass,
      role: "ADMIN",
    },
  });

  await prisma.adminAccount.upsert({
    where: { email: "dev@gmail.com" },
    update: {
      passwordHash: adminPass,
    },
    create: {
      email: "dev@gmail.com",
      username: "developer",
      fullName: "Developer Admin",
      passwordHash: adminPass,
      role: "ADMIN",
    },
  });

  console.log("Admins seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
