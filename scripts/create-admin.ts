import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth";

const prisma = new PrismaClient();

async function main() {
  // Get credentials from environment variables or use defaults
  const email = process.env.ADMIN_EMAIL || "admin@sppro.com";
  const password = process.env.ADMIN_PASSWORD || "Admin123!@#";
  const firstName = process.env.ADMIN_FIRST_NAME || "Admin";
  const lastName = process.env.ADMIN_LAST_NAME || "User";
  const phone = process.env.ADMIN_PHONE || "081-234-5678";
  
  if (!process.env.DATABASE_URL) {
    console.error("❌ Error: DATABASE_URL is not set!");
    console.error("Please set DATABASE_URL in your environment variables.");
    process.exit(1);
  }
  
  console.log(`📧 Creating admin user with email: ${email}`);
  
  const hashedPassword = await hashPassword(password);

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    console.log("⚠️  Admin user already exists! Updating to admin role...");
    // Update to admin role
    const updated = await prisma.user.update({
      where: { email },
      data: {
        role: "admin",
        password: hashedPassword,
        firstName,
        lastName,
        phone,
      },
    });
    console.log("✅ Admin user updated successfully!");
    console.log(`   Email: ${updated.email}`);
    console.log(`   Name: ${updated.firstName} ${updated.lastName}`);
    console.log(`   Role: ${updated.role}`);
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
    console.log("✅ Admin user created successfully!");
    console.log(`   Email: ${admin.email}`);
    console.log(`   Name: ${admin.firstName} ${admin.lastName}`);
    console.log(`   Role: ${admin.role}`);
  }
  
  console.log("\n🔐 Login credentials:");
  console.log(`   Email: ${email}`);
  console.log(`   Password: ${password}`);
  console.log("\n⚠️  Please change the password after first login!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

