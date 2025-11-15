import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Get credentials from environment variables or use defaults
  const email = process.env.ADMIN_EMAIL || "chana";
  const password = process.env.ADMIN_PASSWORD || "0899213355aaa";
  const firstName = process.env.ADMIN_FIRST_NAME || "Admin";
  const lastName = process.env.ADMIN_LAST_NAME || "User";
  const phone = process.env.ADMIN_PHONE || "089-921-3355";
  
  console.log(`Creating admin user with email: ${email}`);
  
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
        firstName,
        lastName,
        phone,
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

