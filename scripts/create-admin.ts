import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "chana";
  const password = "0899213355aaa";
  const hashedPassword = await bcrypt.hash(password, 10);

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    console.log("Admin user already exists!");
    // Update to admin role
    await prisma.user.update({
      where: { email },
      data: {
        role: "admin",
        password: hashedPassword,
      },
    });
    console.log("Admin user updated!");
  } else {
    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName: "Admin",
        lastName: "User",
        phone: "089-921-3355",
        role: "admin",
      },
    });
    console.log("Admin user created:", admin);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

