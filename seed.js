const prisma = require('./db/prismaClient');
const bcrypt = require('bcrypt');

async function seed() {

  const saltRounds = 10;

  const staffPasswordHash = await bcrypt.hash("password123", saltRounds);
  const managerPasswordHash = await bcrypt.hash("password123", saltRounds);
  const adminPasswordHash = await bcrypt.hash("admin123", saltRounds);

  // Company A
  const companyA = await prisma.company.create({
    data: {
      name: "Demo Company A"
    }
  });

  console.log("Company A created:", companyA);

  // Company B
  const companyB = await prisma.company.create({
    data: {
      name: "Demo Company B"
    }
  });

  console.log("Company B created:", companyB);

  // Staff (Company A)
  const staffUser = await prisma.user.create({
    data: {
      email: "staff@example.com",
      password: staffPasswordHash,
      role: "Staff",
      companyId: companyA.id
    }
  });

  console.log("Staff user created:", staffUser);

  // Manager A
  const managerUserA = await prisma.user.create({
    data: {
      email: "manager@example.com",
      password: managerPasswordHash,
      role: "Manager",
      companyId: companyA.id
    }
  });

  console.log("Manager A created:", managerUserA);

  // Manager B
  const managerUserB = await prisma.user.create({
    data: {
      email: "manager@b.com",
      password: managerPasswordHash,
      role: "Manager",
      companyId: companyB.id
    }
  });

  console.log("Manager B created:", managerUserB);

  // Admin
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@example.com",
      password: adminPasswordHash,
      role: "Admin",
      companyId: companyA.id
    }
  });

  console.log("Admin user created:", adminUser);
}

seed()
  .catch((e) => {
    console.error(e);
  })
  .finally(() => process.exit());