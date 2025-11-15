import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("=== ตรวจสอบ Admin Users ===\n");

  // Find all admin users
  const adminUsers = await prisma.user.findMany({
    where: {
      role: "admin",
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      createdAt: true,
    },
  });

  if (adminUsers.length === 0) {
    console.log("❌ ไม่พบ Admin users ใน database");
  } else {
    console.log(`✅ พบ Admin users ทั้งหมด ${adminUsers.length} คน:\n`);
    adminUsers.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email}`);
      console.log(`   Name: ${user.firstName} ${user.lastName}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Created: ${user.createdAt}`);
      console.log("");
    });
  }

  // Find user with email "chana"
  console.log("\n=== ตรวจสอบ User 'chana' ===\n");
  const chanaUser = await prisma.user.findUnique({
    where: {
      email: "chana",
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      createdAt: true,
    },
  });

  if (!chanaUser) {
    console.log("❌ ไม่พบ user ที่มี email = 'chana'");
  } else {
    console.log("✅ พบ user 'chana':");
    console.log(`   Email: ${chanaUser.email}`);
    console.log(`   Name: ${chanaUser.firstName} ${chanaUser.lastName}`);
    console.log(`   Role: ${chanaUser.role}`);
    console.log(`   ID: ${chanaUser.id}`);
    console.log(`   Created: ${chanaUser.createdAt}`);
    
    if (chanaUser.role === "admin") {
      console.log("\n✅ User 'chana' มี role เป็น admin");
    } else {
      console.log(`\n❌ User 'chana' มี role เป็น '${chanaUser.role}' (ไม่ใช่ admin)`);
      console.log("\nต้องการเปลี่ยน role เป็น admin หรือไม่?");
    }
  }

  // List all users
  console.log("\n=== รายชื่อ Users ทั้งหมด ===\n");
  const allUsers = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  console.log(`พบ Users ทั้งหมด ${allUsers.length} คน:\n`);
  allUsers.forEach((user, index) => {
    const roleBadge = user.role === "admin" ? "🔴 ADMIN" : "⚪ USER";
    console.log(`${index + 1}. ${roleBadge} - ${user.email} (${user.firstName} ${user.lastName})`);
  });
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

