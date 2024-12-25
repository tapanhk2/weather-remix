import { PrismaClient } from "@prisma/client";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
// npx run dev
const seedData = [
  {
    username: "ipgautomotive",
    password: "carmaker",
    isActive: 'Y'
    
  },
 ];
 
async function seed() {

 try {
   for (const user of seedData) {
    const hashedPassword = await bcrypt.hash(user?.password, 10);
     await prisma.users
     .create({
       data: {
        username: user?.username,
        password: hashedPassword,
        is_active: 'Y'
      },
     });
   }

   console.log("Seed data has been inserted successfully.");
 } catch (error) {
   console.error("Error seeding data:", error);
 } finally {
   await prisma.$disconnect();
 }
}

seed();
